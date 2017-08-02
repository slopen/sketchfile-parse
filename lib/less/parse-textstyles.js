'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _run = require('../run');

var _run2 = _interopRequireDefault(_run);

var _file = require('../file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var outputDir = './data';
var globalFontSize = 16;

var binarizeStyle = function binarizeStyle(data) {
    return new Promise(function (resolve, reject) {
        var buf = Buffer.from(data, 'base64');
        var stream = _fs2.default.createWriteStream(_path2.default.resolve(process.env.PWD, './temp/temp.bin'));

        stream.on('error', reject);
        stream.on('finish', resolve);

        stream.write(buf);
        stream.end();
    });
};

var xmlizeStyle = function xmlizeStyle() {
    var input = _path2.default.resolve(process.env.PWD, './temp/temp.bin');
    var output = _path2.default.resolve(process.env.PWD, './temp/temp.xml');

    return (0, _run2.default)('plutil -convert xml1 -o ' + output + ' ' + input);
};

var readAsXML = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref2) {
        var base64Data = _ref2._archive;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return binarizeStyle(base64Data);

                    case 2:
                        _context.next = 4;
                        return xmlizeStyle();

                    case 4:
                        _context.next = 6;
                        return (0, _file.readFile)(_path2.default.resolve(process.env.PWD, './temp/temp.xml'));

                    case 6:
                        return _context.abrupt('return', _context.sent);

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function readAsXML(_x) {
        return _ref.apply(this, arguments);
    };
}();

var variableName = function variableName(name) {
    return 'font-' + name.replace(/\s|\//g, '-').replace(/(-)+/g, '-').toLowerCase();
};

var parseColor = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(archiveData) {
        var data, colorBase64, _Buffer$from$toString, _Buffer$from$toString2, red, green, blue;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return readAsXML(archiveData);

                    case 2:
                        data = _context2.sent;
                        colorBase64 = data.match(/<key>NSRGB<\/key>[^<]+<data>\n\t+(.+)\n\t+<\/data>/im)[1];
                        _Buffer$from$toString = Buffer.from(colorBase64, 'base64').toString().match(/\d+\.?\d*/g), _Buffer$from$toString2 = _slicedToArray(_Buffer$from$toString, 3), red = _Buffer$from$toString2[0], green = _Buffer$from$toString2[1], blue = _Buffer$from$toString2[2];
                        return _context2.abrupt('return', { red: red, green: green, blue: blue });

                    case 6:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function parseColor(_x2) {
        return _ref3.apply(this, arguments);
    };
}();

var parseParagraph = function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(archiveData) {
        var data, lineHeight;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return readAsXML(archiveData);

                    case 2:
                        data = _context3.sent;
                        lineHeight = data.match(/<key>NSMaxLineHeight<\/key>[^<]+<real>(.+)<\/real>/im);
                        return _context3.abrupt('return', {
                            lineHeight: lineHeight && lineHeight[1]
                        });

                    case 5:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function parseParagraph(_x3) {
        return _ref4.apply(this, arguments);
    };
}();

var parseFont = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(archiveData) {
        var data, _data$match, _data$match2, fontSize, fontFamily;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return readAsXML(archiveData);

                    case 2:
                        data = _context4.sent;
                        _data$match = data.match(/<string>NSFontNameAttribute<\/string>[^<]+<real>(.+)<\/real>[^<]+<string>(.+)<\/string>/im), _data$match2 = _slicedToArray(_data$match, 3), fontSize = _data$match2[1], fontFamily = _data$match2[2];
                        return _context4.abrupt('return', { fontSize: fontSize, fontFamily: fontFamily });

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function parseFont(_x4) {
        return _ref5.apply(this, arguments);
    };
}();

var colorToRGBA = function colorToRGBA(_ref6) {
    var red = _ref6.red,
        green = _ref6.green,
        blue = _ref6.blue,
        alpha = _ref6.alpha;
    return 'rgba(' + red * 100 + '%, ' + green * 100 + '%, ' + blue * 100 + '%, ' + alpha * 100 + '%)';
};

var parseTextStyle = function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(name) {
        var input, data, fontData, encodedAttributes, NSColor, NSParagraphStyle, MSAttributedStringFontAttribute, _data$value$contextSe, contextSettings, font, paragraph, _fontData, color, mixin;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return (0, _file.readFile)(name);

                    case 2:
                        input = _context5.sent;
                        data = JSON.parse(input);
                        fontData = {};

                        if (!/centered/i.test(data.name)) {
                            _context5.next = 7;
                            break;
                        }

                        return _context5.abrupt('return', Promise.resolve());

                    case 7:
                        if (!data.value.textStyle) {
                            _context5.next = 28;
                            break;
                        }

                        encodedAttributes = data.value.textStyle.encodedAttributes;
                        NSColor = encodedAttributes.NSColor, NSParagraphStyle = encodedAttributes.NSParagraphStyle, MSAttributedStringFontAttribute = encodedAttributes.MSAttributedStringFontAttribute;

                        if (!NSColor) {
                            _context5.next = 16;
                            break;
                        }

                        _data$value$contextSe = data.value.contextSettings, contextSettings = _data$value$contextSe === undefined ? {} : _data$value$contextSe;
                        _context5.next = 14;
                        return parseColor(NSColor);

                    case 14:
                        fontData.color = _context5.sent;

                        fontData.color.alpha = contextSettings.opacity ? contextSettings.opacity : 1;

                    case 16:
                        if (!MSAttributedStringFontAttribute) {
                            _context5.next = 21;
                            break;
                        }

                        _context5.next = 19;
                        return parseFont(MSAttributedStringFontAttribute);

                    case 19:
                        font = _context5.sent;


                        fontData = _extends({}, fontData, font);

                    case 21:
                        if (!NSParagraphStyle) {
                            _context5.next = 26;
                            break;
                        }

                        _context5.next = 24;
                        return parseParagraph(NSParagraphStyle);

                    case 24:
                        paragraph = _context5.sent;


                        fontData = _extends({}, fontData, paragraph);

                    case 26:

                        // eslint-disable-next-line no-unused-vars
                        _fontData = fontData, color = _fontData.color, mixin = _objectWithoutProperties(_fontData, ['color']);
                        return _context5.abrupt('return', {
                            name: variableName(data.name),
                            color: colorToRGBA(fontData.color),
                            mixin: mixin
                        });

                    case 28:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function parseTextStyle(_x5) {
        return _ref7.apply(this, arguments);
    };
}();

var buildTextMixin = function buildTextMixin(_ref8) {
    var name = _ref8.name,
        _ref8$mixin = _ref8.mixin,
        fontFamily = _ref8$mixin.fontFamily,
        fontSize = _ref8$mixin.fontSize,
        lineHeight = _ref8$mixin.lineHeight;
    return '\t@text-style-line-height:' + lineHeight / fontSize + 'em;\n\n' + ('\tfont-family: \'' + fontFamily + '\';\n') + ('\tfont-size: ' + fontSize / globalFontSize + 'rem;\n') + '\tline-height: @text-style-line-height;\n' + ('\tcolor: @' + name + '-color;\n');
};

var parseTextStyles = function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(outputDir) {
        var styles, files, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        styles = [];
                        files = (0, _file.dirFiles)(outputDir + '/styles');
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context7.prev = 5;
                        _iterator = files[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context7.next = 19;
                            break;
                        }

                        name = _step.value;
                        _context7.prev = 9;
                        return _context7.delegateYield(regeneratorRuntime.mark(function _callee6() {
                            var style;
                            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            _context6.next = 2;
                                            return parseTextStyle(outputDir + '/styles/' + name);

                                        case 2:
                                            style = _context6.sent;


                                            if (style && !styles.some(function (i) {
                                                return i.name == style.name;
                                            })) {
                                                console.log('* text style:', style.name);
                                                styles.push(style);
                                            }

                                        case 4:
                                        case 'end':
                                            return _context6.stop();
                                    }
                                }
                            }, _callee6, undefined);
                        })(), 't0', 11);

                    case 11:
                        _context7.next = 16;
                        break;

                    case 13:
                        _context7.prev = 13;
                        _context7.t1 = _context7['catch'](9);

                        console.error('* skipping text style:', name, 'error', _context7.t1.message);

                    case 16:
                        _iteratorNormalCompletion = true;
                        _context7.next = 7;
                        break;

                    case 19:
                        _context7.next = 25;
                        break;

                    case 21:
                        _context7.prev = 21;
                        _context7.t2 = _context7['catch'](5);
                        _didIteratorError = true;
                        _iteratorError = _context7.t2;

                    case 25:
                        _context7.prev = 25;
                        _context7.prev = 26;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 28:
                        _context7.prev = 28;

                        if (!_didIteratorError) {
                            _context7.next = 31;
                            break;
                        }

                        throw _iteratorError;

                    case 31:
                        return _context7.finish(28);

                    case 32:
                        return _context7.finish(25);

                    case 33:
                        _context7.next = 35;
                        return (0, _file.writeFile)(outputDir + '/less/text-colors.less', styles.map(function (_ref10) {
                            var name = _ref10.name,
                                color = _ref10.color;
                            return '@' + name + '-color: ' + color + ';';
                        }).sort(function (a, b) {
                            return a.localeCompare(b);
                        }).join('\n'));

                    case 35:
                        _context7.next = 37;
                        return (0, _file.writeFile)(outputDir + '/less/text-mixins.less', styles.map(function (fontData) {
                            return '.' + fontData.name + '{\n' + ('' + buildTextMixin(fontData)) + '}\n';
                        }).sort(function (a, b) {
                            return a.localeCompare(b);
                        }).join('\n'));

                    case 37:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined, [[5, 21, 25, 33], [9, 13], [26,, 28, 32]]);
    }));

    return function parseTextStyles(_x6) {
        return _ref9.apply(this, arguments);
    };
}();

exports.default = function () {
    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(PWD) {
        var output = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : outputDir;
        var outputFolder;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        outputFolder = _path2.default.resolve(PWD, output);
                        _context8.next = 3;
                        return (0, _run2.default)('mkdir ./temp');

                    case 3:
                        _context8.prev = 3;
                        _context8.next = 6;
                        return parseTextStyles(outputFolder);

                    case 6:
                        _context8.next = 11;
                        break;

                    case 8:
                        _context8.prev = 8;
                        _context8.t0 = _context8['catch'](3);

                        console.error(_context8.t0.stack || _context8.t0);

                    case 11:

                        console.log('* parse textstyles finished');

                    case 12:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined, [[3, 8]]);
    }));

    return function (_x7) {
        return _ref11.apply(this, arguments);
    };
}();