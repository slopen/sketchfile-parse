import path from 'path';

import run from './run';

import {
	dirFiles,
	readFile,
	writeFile
} from './file';


const outputDir = './data';
const outputFilename = './sketchfile.sketch';

const prepare = (outputDir) =>
	run ([
		`mkdir ${outputDir}`,
		`mkdir ${outputDir}/less`,
		`mkdir ${outputDir}/styles`,
		`mkdir ${outputDir}/symbols`
	].join ('; '));


const unpack = (filename, outputDir) =>
	run (
		`unzip -o ${filename} -d ${outputDir}`
	);


const reorder = (obj, outputDir) => {
	const clone = {};

	const keys = Object
		.keys (obj)
		.sort ((a, b) => a.localeCompare (b));

	keys.forEach ((key) => {
		clone [key] = obj [key];

		if (
			!/^[0-9A-Z]{8}-[0-9A-Z]{4}/.test (key) &&
			typeof clone [key] === 'object'
		) {
			if (Array.isArray (clone [key])) {
				clone [key] = clone [key].map (
					(value) => typeof value === 'object'
						? reorder (value, outputDir) : value
				);
			} else {
				clone [key] = reorder (clone [key], outputDir);
			}
		}
	});

	if (clone._class === 'symbolMaster') {
		writeFile (
			outputDir + '/symbols/' + clone.symbolID + '.json',
			JSON.stringify (clone, null, 4)
		);
	} else if (clone._class === 'sharedStyle') {
		writeFile (
			outputDir + '/styles/' + clone.do_objectID + '.json',
			JSON.stringify (clone, null, 4)
		);
	}

	return clone;
}

const indent = (data, outputDir) => {
	const dataObject = JSON.parse (data);
	const clone = reorder (dataObject, outputDir);

	return JSON.stringify (clone, null, 4);
}

const parseFile = (outputDir, name) =>
	readFile (outputDir + name)
		.then ((data) =>
			writeFile (
				outputDir + name,
				indent (data, outputDir)
			)
		);

export default async (
	PWD,
	filename = outputFilename,
	output = outputDir
) => {
	const outputFolder = path.resolve (PWD, output);

	await prepare (outputFolder);
	await unpack (filename, outputFolder);

	console.log ('* unpacked: ', filename);

	await parseFile (outputFolder, '/document.json');
	await parseFile (outputFolder, '/meta.json');
	await parseFile (outputFolder, '/user.json');

    const pages = dirFiles (outputFolder + '/pages');

    for (let name of pages) {
        await parseFile (outputFolder, '/pages/' + name)
    }

	console.log ('* unpacking finished');
}

