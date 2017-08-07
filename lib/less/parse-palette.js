'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _file = require('../file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var outputDir = './data';

var variableName = function variableName(name) {
    return name.replace(/\s|\//g, '-').replace(/(-)+/g, '-').toLowerCase();
};

var extractPallette = function extractPallette(data) {
    var result = {};

    var _data$value$contextSe = data.value.contextSettings,
        contextSettings = _data$value$contextSe === undefined ? {} : _data$value$contextSe;
    var opacity = contextSettings.opacity;


    if (opacity) {
        result.opacity = (opacity * 100).toFixed(2);
    }

    var _data$value$fills = data.value.fills,
        fills = _data$value$fills === undefined ? [{}] : _data$value$fills;
    var color = fills[0].color;


    if (color) {
        result.color = {
            alpha: color.alpha * 100,
            red: color.red * 100,
            green: color.green * 100,
            blue: color.blue * 100
        };
    }

    var _result$color = result.color,
        red = _result$color.red,
        green = _result$color.green,
        blue = _result$color.blue,
        alpha = _result$color.alpha;

    var rgba = 'rgba(' + red + '%, ' + green + '%, ' + blue + '%, ' + alpha + '%)';
    var name = variableName(data.name);

    var value = result.opacity ? 'fade(' + rgba + ', ' + result.opacity + '%)' : rgba;

    return {
        name: name,
        value: '@' + name + ': ' + value + ';'
    };
};

var parsePaletteStyle = function parsePaletteStyle(name) {
    return (0, _file.readFile)(name).then(function (input) {
        var data = JSON.parse(input);

        if (/palette/i.test(data.name)) {
            if (data.value.fills) {
                return Promise.resolve(extractPallette(data));
            }
        }

        return Promise.resolve();
    });
};

var parsePalette = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(outputDir) {
        var styles, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, style;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        styles = [];
                        files = (0, _file.dirFiles)(outputDir + '/styles');
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 5;
                        _iterator = files[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 16;
                            break;
                        }

                        name = _step.value;
                        _context.next = 11;
                        return parsePaletteStyle(outputDir + '/styles/' + name);

                    case 11:
                        style = _context.sent;


                        if (style) {
                            console.log('* palette style:', style.name);
                            styles.push(style);
                        }

                    case 13:
                        _iteratorNormalCompletion = true;
                        _context.next = 7;
                        break;

                    case 16:
                        _context.next = 22;
                        break;

                    case 18:
                        _context.prev = 18;
                        _context.t0 = _context['catch'](5);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 22:
                        _context.prev = 22;
                        _context.prev = 23;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 25:
                        _context.prev = 25;

                        if (!_didIteratorError) {
                            _context.next = 28;
                            break;
                        }

                        throw _iteratorError;

                    case 28:
                        return _context.finish(25);

                    case 29:
                        return _context.finish(22);

                    case 30:
                        _context.next = 32;
                        return (0, _file.writeFile)(outputDir + '/less/palette.less', styles.map(function (_ref2) {
                            var value = _ref2.value;
                            return value;
                        }).sort(function (a, b) {
                            return a.localeCompare(b);
                        }).join('\n'));

                    case 32:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[5, 18, 22, 30], [23,, 25, 29]]);
    }));

    return function parsePalette(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.default = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(PWD) {
        var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : outputDir;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return parsePalette(_path2.default.resolve(PWD, output));

                    case 2:

                        console.log('* parse palette finished');

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x2) {
        return _ref3.apply(this, arguments);
    };
}();