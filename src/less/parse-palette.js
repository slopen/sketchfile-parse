import path from 'path';

import {
    dirFiles,
    readFile,
    writeFile
} from '../file';

const outputDir = './data';

const variableName = (name) =>
    name
        .replace (/\s|\//g, '-')
        .replace (/(-)+/g, '-')
        .toLowerCase ();


const extractPallette = (data) => {
    const result = {};

    const {contextSettings = {}} = data.value;
    const {opacity} = contextSettings;

    if (opacity) {
        result.opacity = opacity.toFixed (4);
    }

    const {fills = [{}]} = data.value;
    const {color} = fills [0];

    if (color) {
        result.color = {
            alpha: color.alpha * 100,
            red: color.red * 100,
            green: color.green * 100,
            blue: color.blue * 100
        };
    }

    const {red, green, blue, alpha} = result.color;
    const rgba = `rgba(${red}%, ${green}%, ${blue}%, ${alpha}%)`;
    const name = variableName (data.name);

    const value = result.opacity
        ? `fade(${rgba}, ${result.opacity}%)`
        : rgba;

    return {
        name,
        value: `@${name}: ${value};`
    };
}


const parsePaletteStyle = (name) =>
    readFile (name)
        .then ((input) => {
            const data = JSON.parse (input);

            if (/palette/i.test (data.name)) {
                if (data.value.fills) {
                    return Promise
                        .resolve (extractPallette (data));
                }
            }

            return Promise.resolve ();
        });

const parsePalette = async (outputDir) => {
    const styles = [];

    const files = dirFiles (outputDir + '/styles');

    for (let name of files) {
        const style = await parsePaletteStyle (
            outputDir + '/styles/' + name
        );

        if (style) {
            console.log ('* palette style:', style.name);
            styles.push (style);
        }
    }

    await writeFile (
        outputDir + '/less/palette.less',
        styles
            .map (({value}) => value)
            .sort ((a, b) => a.localeCompare (b))
            .join ('\n')
    );
}

export default async (
    PWD,
    output = outputDir
) => {

    await parsePalette (
        path.resolve (PWD, output)
    );

    console.log ('* parse palette finished');
};

