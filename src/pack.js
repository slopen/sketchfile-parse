import path from 'path';

import run from './run';

import {
    dirFiles,
    readFile,
    writeFile
} from './file';

const inputDir = './data';
const outputFilename = './sketchfile.sketch';

const styles = {};
const symbols = {};

const syncStyle = (symbol) => {
    const {style, layers} = symbol || {};
    const {sharedObjectID} = style || {};

    const sharedStyle = sharedObjectID &&
        styles [sharedObjectID];

    if (sharedStyle) {
        symbol.style = Object.assign (JSON.parse (
            JSON.stringify (symbol.style)
        ), sharedStyle.value);
    }

    if (layers) {
        layers.forEach ((layer, index) =>
            layers [index] = syncStyle (layer)
        );
    }

    return symbol;
}

const syncSymbolsStyles = (input) =>
    input.sort ((a, b) =>
        b.name.localeCompare (a.name)
    )
    .map ((symbol) =>
        syncStyle (symbol)
    );

const packSymbols = async (inputDir) => {
    const result = [];

    const styleFiles = dirFiles (inputDir + '/styles');

    for (let name of styleFiles) {
        const style = JSON.parse (
            await readFile (inputDir + '/styles/' + name)
        );

        styles [style.do_objectID] = style;
    }

    const symbolFiles = dirFiles (inputDir + '/symbols');

    for (let name of symbolFiles) {
        const symbol = JSON.parse (
            await readFile (inputDir + '/symbols/' + name)
        );

        symbols [symbol.symbolID] = symbol;
        result.push (symbol);
    }

    const pagesFiles = dirFiles (inputDir + '/pages');

    for (let name of pagesFiles) {
        const data = JSON.parse (
            await readFile (inputDir + '/pages/' + name)
        );

        if (data.name === 'Symbols') {
            data.layers = syncSymbolsStyles (result);

            await writeFile (
                inputDir + '/pages/' + name,
                JSON.stringify (data, null, 4)
            );
        }
    }
}

const pack = (inputDir, outputFilename, name) =>
    run ([
        `cd ${inputDir}`,
        `zip -u ${outputFilename} ${name}`,
        `cd ${process.env.PWD}`
    ].join ('; '));


export default async (
    PWD,
    output = outputFilename,
    input = inputDir
) => {
    const inputFolder = path.resolve (PWD, input);
    const outputFile = path.resolve (PWD, output);

    console.log ('* prepare');

    await packSymbols (inputFolder);

    console.log ('* packing');

    await pack (inputFolder, outputFile, './document.json');
    await pack (inputFolder, outputFile, './meta.json');
    await pack (inputFolder, outputFile, './user.json');

    await pack (inputFolder, outputFile, './previews/*');
    await pack (inputFolder, outputFile, './images/*');
    await pack (inputFolder, outputFile, './pages/*');

    console.log ('* packing finished');
}

