'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _child_process = require('child_process');

exports.default = function (command) {
    return new Promise(function (resolve) {
        var child = (0, _child_process.exec)(command);

        child.stdout.removeAllListeners('data');
        child.stdout.pipe(process.stdout);

        child.stderr.removeAllListeners('data');
        child.stderr.pipe(process.stderr);

        child.on('exit', function () {
            return resolve();
        });
    });
};