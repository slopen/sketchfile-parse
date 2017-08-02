'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

var _file = require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var inputDir = './data';
var outputFilename = './sketchfile.sketch';

var styles = {};
var symbols = {};

var syncStyle = function syncStyle(symbol) {
    var _ref = symbol || {},
        style = _ref.style,
        layers = _ref.layers;

    var _ref2 = style || {},
        sharedObjectID = _ref2.sharedObjectID;

    var sharedStyle = sharedObjectID && styles[sharedObjectID];

    if (sharedStyle) {
        symbol.style = Object.assign(JSON.parse(JSON.stringify(symbol.style)), sharedStyle.value);
    }

    if (layers) {
        layers.forEach(function (layer, index) {
            return layers[index] = syncStyle(layer);
        });
    }

    return symbol;
};

var syncSymbolsStyles = function syncSymbolsStyles(input) {
    return input.sort(function (a, b) {
        return b.name.localeCompare(a.name);
    }).map(function (symbol) {
        return syncStyle(symbol);
    });
};

var packSymbols = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(inputDir) {
        var result, styleFiles, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, style, symbolFiles, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _name, symbol, pagesFiles, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _name2, data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        result = [];
                        styleFiles = (0, _file.dirFiles)(inputDir + '/styles');
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 5;
                        _iterator = styleFiles[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 18;
                            break;
                        }

                        name = _step.value;
                        _context.t0 = JSON;
                        _context.next = 12;
                        return (0, _file.readFile)(inputDir + '/styles/' + name);

                    case 12:
                        _context.t1 = _context.sent;
                        style = _context.t0.parse.call(_context.t0, _context.t1);


                        styles[style.do_objectID] = style;

                    case 15:
                        _iteratorNormalCompletion = true;
                        _context.next = 7;
                        break;

                    case 18:
                        _context.next = 24;
                        break;

                    case 20:
                        _context.prev = 20;
                        _context.t2 = _context['catch'](5);
                        _didIteratorError = true;
                        _iteratorError = _context.t2;

                    case 24:
                        _context.prev = 24;
                        _context.prev = 25;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 27:
                        _context.prev = 27;

                        if (!_didIteratorError) {
                            _context.next = 30;
                            break;
                        }

                        throw _iteratorError;

                    case 30:
                        return _context.finish(27);

                    case 31:
                        return _context.finish(24);

                    case 32:
                        symbolFiles = (0, _file.dirFiles)(inputDir + '/symbols');
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 36;
                        _iterator2 = symbolFiles[Symbol.iterator]();

                    case 38:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 50;
                            break;
                        }

                        _name = _step2.value;
                        _context.t3 = JSON;
                        _context.next = 43;
                        return (0, _file.readFile)(inputDir + '/symbols/' + _name);

                    case 43:
                        _context.t4 = _context.sent;
                        symbol = _context.t3.parse.call(_context.t3, _context.t4);


                        symbols[symbol.symbolID] = symbol;
                        result.push(symbol);

                    case 47:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 38;
                        break;

                    case 50:
                        _context.next = 56;
                        break;

                    case 52:
                        _context.prev = 52;
                        _context.t5 = _context['catch'](36);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t5;

                    case 56:
                        _context.prev = 56;
                        _context.prev = 57;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 59:
                        _context.prev = 59;

                        if (!_didIteratorError2) {
                            _context.next = 62;
                            break;
                        }

                        throw _iteratorError2;

                    case 62:
                        return _context.finish(59);

                    case 63:
                        return _context.finish(56);

                    case 64:
                        pagesFiles = (0, _file.dirFiles)(inputDir + '/pages');
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context.prev = 68;
                        _iterator3 = pagesFiles[Symbol.iterator]();

                    case 70:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context.next = 84;
                            break;
                        }

                        _name2 = _step3.value;
                        _context.t6 = JSON;
                        _context.next = 75;
                        return (0, _file.readFile)(inputDir + '/pages/' + _name2);

                    case 75:
                        _context.t7 = _context.sent;
                        data = _context.t6.parse.call(_context.t6, _context.t7);

                        if (!(data.name === 'Symbols')) {
                            _context.next = 81;
                            break;
                        }

                        data.layers = syncSymbolsStyles(result);

                        _context.next = 81;
                        return (0, _file.writeFile)(inputDir + '/pages/' + _name2, JSON.stringify(data, null, 4));

                    case 81:
                        _iteratorNormalCompletion3 = true;
                        _context.next = 70;
                        break;

                    case 84:
                        _context.next = 90;
                        break;

                    case 86:
                        _context.prev = 86;
                        _context.t8 = _context['catch'](68);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context.t8;

                    case 90:
                        _context.prev = 90;
                        _context.prev = 91;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 93:
                        _context.prev = 93;

                        if (!_didIteratorError3) {
                            _context.next = 96;
                            break;
                        }

                        throw _iteratorError3;

                    case 96:
                        return _context.finish(93);

                    case 97:
                        return _context.finish(90);

                    case 98:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[5, 20, 24, 32], [25,, 27, 31], [36, 52, 56, 64], [57,, 59, 63], [68, 86, 90, 98], [91,, 93, 97]]);
    }));

    return function packSymbols(_x) {
        return _ref3.apply(this, arguments);
    };
}();

var pack = function pack(inputDir, outputFilename, name) {
    return (0, _run2.default)(['cd ' + inputDir, 'zip -u ' + outputFilename + ' ' + name, 'cd ' + process.env.PWD].join('; '));
};

exports.default = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(PWD) {
        var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : outputFilename;
        var input = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : inputDir;
        var inputFolder, outputFile;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        inputFolder = _path2.default.resolve(PWD, input);
                        outputFile = _path2.default.resolve(PWD, output);


                        console.log('* prepare');

                        _context2.next = 5;
                        return packSymbols(inputFolder);

                    case 5:

                        console.log('* packing');

                        _context2.next = 8;
                        return pack(inputFolder, outputFile, './document.json');

                    case 8:
                        _context2.next = 10;
                        return pack(inputFolder, outputFile, './meta.json');

                    case 10:
                        _context2.next = 12;
                        return pack(inputFolder, outputFile, './user.json');

                    case 12:
                        _context2.next = 14;
                        return pack(inputFolder, outputFile, './previews/*');

                    case 14:
                        _context2.next = 16;
                        return pack(inputFolder, outputFile, './images/*');

                    case 16:
                        _context2.next = 18;
                        return pack(inputFolder, outputFile, './pages/*');

                    case 18:

                        console.log('* packing finished');

                    case 19:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x2) {
        return _ref4.apply(this, arguments);
    };
}();