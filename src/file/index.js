import fs from 'fs';

export const readFile = (name) =>
    new Promise ((resolve, reject) =>
        fs.readFile (name, 'utf8', (err, data) =>
            err ? reject (err) : resolve (data)
        )
    );

export const writeFile = (name, data) =>
    new Promise ((resolve, reject) =>
        fs.writeFile (name, data, (err) =>
            err ? reject (err) : resolve ()
        )
    );

export const dirFiles = (dirName) =>
    fs.readdirSync (dirName)
        .filter ((name) => !/^\./.test (name));