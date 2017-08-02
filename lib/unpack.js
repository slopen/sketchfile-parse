'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

var _file = require('./file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var outputDir = './data';
var outputFilename = './sketchfile.sketch';

var prepare = function prepare(outputDir) {
	return (0, _run2.default)(['rm -rf ' + outputDir, 'mkdir ' + outputDir, 'mkdir ' + outputDir + '/less', 'mkdir ' + outputDir + '/styles', 'mkdir ' + outputDir + '/symbols'].join(' && '));
};

var unpack = function unpack(filename, outputDir) {
	return (0, _run2.default)('unzip -o ' + filename + ' -d ' + outputDir);
};

var reorder = function reorder(obj, outputDir) {
	var clone = {};

	var keys = Object.keys(obj).sort(function (a, b) {
		return a.localeCompare(b);
	});

	keys.forEach(function (key) {
		clone[key] = obj[key];

		if (!/^[0-9A-Z]{8}-[0-9A-Z]{4}/.test(key) && _typeof(clone[key]) === 'object') {
			if (Array.isArray(clone[key])) {
				clone[key] = clone[key].map(function (value) {
					return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' ? reorder(value, outputDir) : value;
				});
			} else {
				clone[key] = reorder(clone[key], outputDir);
			}
		}
	});

	if (clone._class === 'symbolMaster') {
		(0, _file.writeFile)(outputDir + '/symbols/' + clone.symbolID + '.json', JSON.stringify(clone, null, 4));
	} else if (clone._class === 'sharedStyle') {
		(0, _file.writeFile)(outputDir + '/styles/' + clone.do_objectID + '.json', JSON.stringify(clone, null, 4));
	}

	return clone;
};

var indent = function indent(data, outputDir) {
	var dataObject = JSON.parse(data);
	var clone = reorder(dataObject, outputDir);

	return JSON.stringify(clone, null, 4);
};

var parseFile = function parseFile(outputDir, name) {
	return (0, _file.readFile)(outputDir + name).then(function (data) {
		return (0, _file.writeFile)(outputDir + name, indent(data, outputDir));
	});
};

exports.default = function () {
	var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(PWD) {
		var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : outputFilename;
		var output = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : outputDir;

		var outputFolder, pages, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name;

		return regeneratorRuntime.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						outputFolder = _path2.default.resolve(PWD, output);
						_context.next = 3;
						return prepare(outputFolder);

					case 3:
						_context.next = 5;
						return unpack(filename, outputFolder);

					case 5:

						console.log('* unpacked: ', filename);

						_context.next = 8;
						return parseFile(outputFolder, '/document.json');

					case 8:
						_context.next = 10;
						return parseFile(outputFolder, '/meta.json');

					case 10:
						_context.next = 12;
						return parseFile(outputFolder, '/user.json');

					case 12:
						pages = (0, _file.dirFiles)(outputFolder + '/pages');
						_iteratorNormalCompletion = true;
						_didIteratorError = false;
						_iteratorError = undefined;
						_context.prev = 16;
						_iterator = pages[Symbol.iterator]();

					case 18:
						if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
							_context.next = 25;
							break;
						}

						name = _step.value;
						_context.next = 22;
						return parseFile(outputFolder, '/pages/' + name);

					case 22:
						_iteratorNormalCompletion = true;
						_context.next = 18;
						break;

					case 25:
						_context.next = 31;
						break;

					case 27:
						_context.prev = 27;
						_context.t0 = _context['catch'](16);
						_didIteratorError = true;
						_iteratorError = _context.t0;

					case 31:
						_context.prev = 31;
						_context.prev = 32;

						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}

					case 34:
						_context.prev = 34;

						if (!_didIteratorError) {
							_context.next = 37;
							break;
						}

						throw _iteratorError;

					case 37:
						return _context.finish(34);

					case 38:
						return _context.finish(31);

					case 39:

						console.log('* unpacking finished');

					case 40:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, undefined, [[16, 27, 31, 39], [32,, 34, 38]]);
	}));

	return function (_x) {
		return _ref.apply(this, arguments);
	};
}();