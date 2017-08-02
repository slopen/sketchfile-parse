import {exec} from 'child_process';

export default (command) =>
    new Promise ((resolve) => {
        const child = exec (command);

        child.stdout.removeAllListeners ('data');
        child.stdout.pipe (process.stdout);

        child.stderr.removeAllListeners ('data');
        child.stderr.pipe (process.stderr);

        child.on ('exit', () => resolve ());
    });