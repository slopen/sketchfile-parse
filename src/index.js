import pack from './pack';
import unpack from './unpack';

import parsePalette from './less/parse-palette';
import parseTextStyles from './less/parse-textstyles';
import parseTextMixins from './less/parse-textmixins';

const run = async (argv, PWD) => {
    switch (argv [2]) {

        case '--unpack': {
            const filename = argv [3];
            const outputDir = argv [4];

            await unpack (PWD, filename, outputDir);

            break;
        }

        case '--extract': {
            const filename = argv [3];
            const outputDir = argv [4];

            await unpack (PWD, filename, outputDir);
            await parsePalette (PWD, outputDir);
            await parseTextMixins (PWD, outputDir);

            break;
        }

        case '--extract:raw': {
            const filename = argv [3];
            const outputDir = argv [4];

            await unpack (PWD, filename, outputDir);
            await parsePalette (PWD, outputDir);
            await parseTextStyles (PWD, outputDir);

            break;
        }

        case '--pack': {
            const filename = argv [3];
            const inputDir = argv [4];

            await pack (PWD, filename, inputDir);

            break;
        }

        default:
            throw new Error (
                `unkown command sketchfile-parse ${argv [2]}`
            );
    }
}

(async () => {
    try {
        await run (process.argv, process.env.PWD || '')
    } catch (e) {
        console.error ('sketchfile-parse error:', e);
    }
}) ();