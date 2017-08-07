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

const accentMap = {
    'accent-1': 'success',
    'accent-2': 'warning',
    'accent-3': 'danger'
};

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
    name
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

const fontFamilyMixin = ({normal, emphase}) =>
`@font-family-normal: '${normal}';
@font-family-emphase: '${emphase}';`;

const colorEmphaseMixins =
`.font-style (@emphase){
    @font-family: "font-family-@{emphase}";
    font-family: @@font-family;
}

.font-color (
    @type;
    @emphase;
    @inverse;
    @accent;
) {
    @color: "font-@{type}-@{emphase}-@{accent}-@{inverse}-color";
    color: @@color;
}`;

const buildFontSizeMixin = ({
    name,
    fontSize,
    lineHeight
}) =>
`.font-${name}{
    @text-style-line-height:${lineHeight / fontSize}em;

    font-size: ${fontSize / globalFontSize}rem;
    line-height: @text-style-line-height;
}`;

const buildTextStyleMixin = ({name}) =>
`.text-style (
    @type;
    @emphase: 'normal';
    @inverse: 'normal';
    @accent: 'normal';
) when (@type = '${name}'){
    .font-${name}();
    .font-style(@emphase);
    .font-color(@type; @emphase; @inverse; @accent);
}`;

const mergeToMixins = (styles) => {
    const data = {
        fonts: {
            normal: null,
            emphase: null
        },
        styles: {}
    };

    styles.forEach ((style) => {
        const styleName = style
            .name
            .match (/^\d+-([^-]+)/);

        const name = styleName && styleName [1];

        if (name && !data.styles [name])  {
            const {
                fontSize,
                lineHeight,
                fontFamily
            } = style.mixin;

            // TODO: improve fonts extract
            if (fontFamily.match (/bold/gi)) {
                data.fonts.emphase = fontFamily;
            } else {
                data.fonts.normal = fontFamily;
            }

            data.styles [name] = {
                fontSize,
                lineHeight
            };
        }
    });

    data.styles = Object.keys (data.styles)
        .map ((name) => {
            return {
                name,
                ...data.styles [name]
            };
        })

    const result =
        `${fontFamilyMixin (data.fonts)}\n\n` +
        `${colorEmphaseMixins}\n\n` +
        `${data.styles.map (buildFontSizeMixin).join ('\n')}\n\n` +
        `${data.styles.map (buildTextStyleMixin).join ('\n')}`;

    return result;
}

const mergeToColors = (styles) => {
    const parseName = (name) => {
        const nameData = name.split (/-/);

        if (!nameData [0].match (/\d+/)) {
            return {};
        }

        const inverse = name.match (/white/);
        let accent = name.match (
            /disabled|active|secondary|accent-\d/
        );

        if (accent && accent [0]) {
            accent = accentMap [accent [0]] || accent [0];
        }

        return {
            name: nameData [1],
            emphase: nameData [2] == 2 ? 'emphase' : 'normal',
            inverse: inverse ? 'inverse' : 'normal',
            accent: accent || 'normal'
        };
    }

    return styles
        .map ((style) => {
            const {
                name,
                emphase,
                inverse,
                accent
            } = parseName (style.name);

            return name
                ? `\/\/ ${style.name}\n@font-${name}-${emphase}-${accent}-${inverse}-color: ${style.color};\n`
                : null;
        })
        .filter ((text) => text)
        .sort ((a, b) => a.localeCompare (b))
        .join ('\n')
}

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
        mergeToColors (styles)
    );

    await writeFile (
        outputDir + '/less/text-mixins.less',
        mergeToMixins (styles)
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

    console.log ('* parse textmixins finished');
}

