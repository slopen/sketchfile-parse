import path from 'path';
import fs from 'fs';

import run from '../run';

import {
    dirFiles,
    readFile,
    writeFile
} from '../file';

const outputDir = './data';
const globalFontSize = 16;

const binarizeStyle = (data) =>
    new Promise ((resolve, reject) => {
        const buf = Buffer.from (data, 'base64');
        const stream = fs.createWriteStream (
            path.resolve (process.env.PWD, './temp/temp.bin')
        );

        stream.on ('error', reject);
        stream.on ('finish', resolve);

        stream.write (buf);
        stream.end ();
    });

const xmlizeStyle = () => {
    const input = path.resolve (process.env.PWD, './temp/temp.bin');
    const output = path.resolve (process.env.PWD, './temp/temp.xml');

    return run (`plutil -convert xml1 -o ${output} ${input}`);
}

const readAsXML = async ({_archive: base64Data}) => {
    await binarizeStyle (base64Data);
    await xmlizeStyle ();

    return await readFile (
        path.resolve (process.env.PWD, './temp/temp.xml')
    );
}



const variableName = (name) =>
    'font-' + name
        .replace (/\s|\//g, '-')
        .replace (/(-)+/g, '-')
        .toLowerCase ();


const parseColor = async (archiveData) => {
    const data = await readAsXML (archiveData);

    const colorBase64 = data.match (
        /<key>NSRGB<\/key>[^<]+<data>\n\t+(.+)\n\t+<\/data>/im
    ) [1];

    const [red, green, blue] = Buffer
        .from (colorBase64, 'base64')
        .toString ()
        .match (/\d+\.?\d*/g);

    return {red, green, blue};
}

const parseParagraph = async (archiveData) => {
    const data = await readAsXML (archiveData);
    const lineHeight = data.match (
        /<key>NSMaxLineHeight<\/key>[^<]+<real>(.+)<\/real>/im
    );

    return {
        lineHeight: lineHeight && lineHeight [1]
    };
}

const parseFont = async (archiveData) => {
    const data = await readAsXML (archiveData);
    const [, fontSize, fontFamily] = data.match (
        /<string>NSFontNameAttribute<\/string>[^<]+<real>(.+)<\/real>[^<]+<string>(.+)<\/string>/im
    );

    return {fontSize, fontFamily};
}

const colorToRGBA = ({red, green, blue, alpha}) =>
    `rgba(${red * 100}%, ${green * 100}%, ${blue * 100}%, ${alpha * 100}%)`;


const parseTextStyle = async (name) => {
    const input = await readFile (name);
    const data = JSON.parse (input);

    let fontData = {};

    if (/centered/i.test (data.name)) {
        return Promise.resolve ();
    }

    if (data.value.textStyle) {
        const {encodedAttributes} = data.value.textStyle;

        const {
            NSColor,
            NSParagraphStyle,
            MSAttributedStringFontAttribute
        } = encodedAttributes;

        if (NSColor) {
            const {contextSettings = {}} = data.value;

            fontData.color = await parseColor (NSColor);
            fontData.color.alpha = contextSettings.opacity
                ? contextSettings.opacity : 1;
        }

        if (MSAttributedStringFontAttribute) {
            const font = await parseFont (MSAttributedStringFontAttribute);

            fontData = {...fontData, ...font};
        }

        if (NSParagraphStyle) {
            const paragraph = await parseParagraph (NSParagraphStyle);

            fontData = {...fontData, ...paragraph};
        }

        // eslint-disable-next-line no-unused-vars
        const {color, ...mixin} = fontData;

        return {
            name: variableName (data.name),
            color: colorToRGBA (fontData.color),
            mixin
        };
    }
}

const buildTextMixin = ({name, mixin: {
    fontFamily,
    fontSize,
    lineHeight
}}) =>
    `\t@text-style-line-height:${lineHeight / fontSize}em;\n\n` +
    `\tfont-family: '${fontFamily}';\n` +
    `\tfont-size: ${fontSize / globalFontSize}rem;\n` +
    `\tline-height: @text-style-line-height;\n` +
    `\tcolor: @${name}-color;\n`;

const parseTextStyles = async (outputDir) => {
    const styles = [];

    const files = dirFiles (outputDir + '/styles');

    for (let name of files) {
        try {
            const style = await parseTextStyle (outputDir + '/styles/' + name);

            if (style && !styles.some ((i) => i.name == style.name)) {
                console.log ('* text style:', style.name);
                styles.push (style);
            }
        } catch (e) {
            console.error ('* skipping text style:', name, 'error', e.message);
        }
    }

    await writeFile (
        outputDir + '/less/text-colors.less',
        styles
            .map (({name, color}) =>
                `@${name}-color: ${color};`
            )
            .sort ((a, b) => a.localeCompare (b))
            .join ('\n')
    );

    await writeFile (
        outputDir + '/less/text-mixins.less',
        styles
            .map ((fontData) =>
                `.${fontData.name}{\n` +
                    `${buildTextMixin (fontData)}` +
                '}\n'
            )
            .sort ((a, b) => a.localeCompare (b))
            .join ('\n')
    );
}

export default async (
    PWD,
    output = outputDir
) => {
    const outputFolder = path.resolve (PWD, output);

    await run ('mkdir ./temp');

    try {
        await parseTextStyles (outputFolder);
    } catch (e) {
        console.error (e.stack || e);
    }

    console.log ('* parse textstyles finished');
}

