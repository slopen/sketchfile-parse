'use strict';

var _pack = require('./pack');

var _pack2 = _interopRequireDefault(_pack);

var _unpack = require('./unpack');

var _unpack2 = _interopRequireDefault(_unpack);

var _parsePalette = require('./less/parse-palette');

var _parsePalette2 = _interopRequireDefault(_parsePalette);

var _parseTextstyles = require('./less/parse-textstyles');

var _parseTextstyles2 = _interopRequireDefault(_parseTextstyles);

var _parseTextmixins = require('./less/parse-textmixins');

var _parseTextmixins2 = _interopRequireDefault(_parseTextmixins);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var run = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(argv, PWD) {
        var filename, outputDir, _filename, _outputDir, _filename2, _outputDir2, _filename3, inputDir;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.t0 = argv[2];
                        _context.next = _context.t0 === '--unpack' ? 3 : _context.t0 === '--extract' ? 8 : _context.t0 === '--extract:raw' ? 17 : _context.t0 === '--pack' ? 26 : 31;
                        break;

                    case 3:
                        filename = argv[3];
                        outputDir = argv[4];
                        _context.next = 7;
                        return (0, _unpack2.default)(PWD, filename, outputDir);

                    case 7:
                        return _context.abrupt('break', 32);

                    case 8:
                        _filename = argv[3];
                        _outputDir = argv[4];
                        _context.next = 12;
                        return (0, _unpack2.default)(PWD, _filename, _outputDir);

                    case 12:
                        _context.next = 14;
                        return (0, _parsePalette2.default)(PWD, _outputDir);

                    case 14:
                        _context.next = 16;
                        return (0, _parseTextmixins2.default)(PWD, _outputDir);

                    case 16:
                        return _context.abrupt('break', 32);

                    case 17:
                        _filename2 = argv[3];
                        _outputDir2 = argv[4];
                        _context.next = 21;
                        return (0, _unpack2.default)(PWD, _filename2, _outputDir2);

                    case 21:
                        _context.next = 23;
                        return (0, _parsePalette2.default)(PWD, _outputDir2);

                    case 23:
                        _context.next = 25;
                        return (0, _parseTextstyles2.default)(PWD, _outputDir2);

                    case 25:
                        return _context.abrupt('break', 32);

                    case 26:
                        _filename3 = argv[3];
                        inputDir = argv[4];
                        _context.next = 30;
                        return (0, _pack2.default)(PWD, _filename3, inputDir);

                    case 30:
                        return _context.abrupt('break', 32);

                    case 31:
                        throw new Error('unkown command sketchfile-parse ' + argv[2]);

                    case 32:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function run(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.prev = 0;
                    _context2.next = 3;
                    return run(process.argv, process.env.PWD || '');

                case 3:
                    _context2.next = 8;
                    break;

                case 5:
                    _context2.prev = 5;
                    _context2.t0 = _context2['catch'](0);

                    console.error('sketchfile-parse error:', _context2.t0);

                case 8:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, undefined, [[0, 5]]);
}))();