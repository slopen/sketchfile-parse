'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dirFiles = exports.writeFile = exports.readFile = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFile = exports.readFile = function readFile(name) {
    return new Promise(function (resolve, reject) {
        return _fs2.default.readFile(name, 'utf8', function (err, data) {
            return err ? reject(err) : resolve(data);
        });
    });
};

var writeFile = exports.writeFile = function writeFile(name, data) {
    return new Promise(function (resolve, reject) {
        return _fs2.default.writeFile(name, data, function (err) {
            return err ? reject(err) : resolve();
        });
    });
};

var dirFiles = exports.dirFiles = function dirFiles(dirName) {
    return _fs2.default.readdirSync(dirName).filter(function (name) {
        return !/^\./.test(name);
    });
};