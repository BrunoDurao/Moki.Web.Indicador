/*! DevExtreme-Intl v16.2.4 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("devextreme/core/config"), require("devextreme/localization"));
	else if(typeof define === 'function' && define.amd)
		define(["devextreme/core/config", "devextreme/localization"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require(undefined), require(undefined)) : factory(root["DevExpress"]["config"], root["DevExpress"]["localization"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var objectAssign = __webpack_require__(2);
	var dxConfig = __webpack_require__(3);
	var locale = __webpack_require__(4).locale;
	var numberLocalization = __webpack_require__(4).number;

	var currencyOptionsCache = {},
	    detectCurrencySymbolRegex = /([^\s0]+)?(\s*)0*[.,]*0*(\s*)([^\s0]+)?/,
	    getFormatter = function(format) {
	        return (new Intl.NumberFormat(locale(), format)).format;
	    },
	    getCurrencyFormatter = function(currency) {
	        return (new Intl.NumberFormat(locale(), { style: 'currency', currency: currency }));
	    };

	numberLocalization.resetInjection();
	numberLocalization.inject({
	    _formatNumberCore: function(value, format, formatConfig) {
	        if(format === 'exponential') {
	            return this.callBase.apply(this, arguments);
	        }

	        return getFormatter(this._normalizeFormatConfig(format, formatConfig))(value);
	    },
	    _normalizeFormatConfig: function(format, formatConfig, value) {
	        var config;

	        if(format === 'decimal') {
	            config = {
	                minimumIntegerDigits: formatConfig.precision || 1,
	                useGrouping: false,
	                maximumFractionDigits: 0,
	                round: value < 0 ? 'ceil' : 'floor'
	            };
	        } else {
	            config = this._getPrecisionConfig(formatConfig.precision);
	        }

	        if(format === 'percent') {
	            config.style = 'percent';
	        } else if(format === 'currency') {
	            config.style = 'currency';
	            config.currency = formatConfig.currency || dxConfig().defaultCurrency;
	        }

	        return config;
	    },
	    _getPrecisionConfig: function(precision) {
	        var config;

	        if(precision === null) {
	            config = {
	                minimumFractionDigits: 0,
	                maximumFractionDigits: 20
	            };
	        } else {
	            config = {
	                minimumFractionDigits: precision || 0,
	                maximumFractionDigits: precision || 0
	            };
	        }

	        return config;
	    },
	    format: function(value, format) {
	        if ('number' !== typeof value) {
	            return value;
	        }

	        format = this._normalizeFormat(format);

	        if (!format || 'function' !== typeof format && !format.type && !format.formatter) {
	            return getFormatter(format)(value);
	        }

	        return this.callBase.apply(this, arguments);
	    },
	    parse: function(text, format) {
	        if(!text) {
	            return;
	        }

	        if(format && format.parser) {
	            return format.parser(text);
	        }

	        text = this._normalizeNumber(text, format);

	        return parseFloat(text);
	    },
	    _normalizeNumber: function(text, format) {
	        var isExponentialRegexp = /^[-+]?[0-9]*.?[0-9]+([eE][-+]?[0-9]+)+$/,
	            legitDecimalSeparator = '.';

	        if(isExponentialRegexp.test(text)) {
	            return text;
	        }

	        var decimalSeparator = this._getDecimalSeparator(format);
	        var cleanUpRegexp = new RegExp('[^0-9\\' + decimalSeparator + ']', 'g');

	        return text.replace(cleanUpRegexp, '').replace(decimalSeparator, legitDecimalSeparator);
	    },
	    _getDecimalSeparator: function(format) {
	        return getFormatter(format)(0.1)[1];
	    },
	    _getCurrencySymbolInfo: function(currency) {
	        var formatter = getCurrencyFormatter(currency);
	        return this._extractCurrencySymbolInfo(formatter.format(0));
	    },
	    _extractCurrencySymbolInfo: function(currencyValueString) {
	        var match = detectCurrencySymbolRegex.exec(currencyValueString) || [],
	            position = match[1] ? 'before' : 'after',
	            symbol = match[1] || match[4] || '',
	            delimiter = match[2] || match[3] || '';

	        return {
	            position: position,
	            symbol: symbol,
	            delimiter: delimiter
	        };
	    },
	    _getCurrencyOptions: function(currency) {
	        var byCurrencyCache = currencyOptionsCache[locale()];

	        if(!byCurrencyCache) {
	            byCurrencyCache = currencyOptionsCache[locale()] = {};
	        }

	        var result = byCurrencyCache[currency];

	        if(!result) {
	            var formatter = getCurrencyFormatter(currency),
	                options = formatter.resolvedOptions(),
	                symbolInfo = this._getCurrencySymbolInfo(currency);

	            result = byCurrencyCache[currency] = objectAssign(options, {
	                currencySymbol: symbolInfo.symbol,
	                currencyPosition: symbolInfo.position,
	                currencyDelimiter: symbolInfo.delimiter
	            });
	        }

	        return result;
	    },
	    _repeatCharacter: function(character, times) {
	        return Array(times + 1).join(character);
	    },
	    _createOpenXmlCurrencyFormat: function(options) {
	        var result = this._repeatCharacter('0', options.minimumIntegerDigits);

	        result += '{0}'; //precision is specified outside

	        if(options.useGrouping) {
	            result = '#,' + this._repeatCharacter('#', 3 - options.minimumIntegerDigits) + result;
	        }

	        if(options.currencySymbol) {
	            if(options.currencyPosition === 'before') {
	                result = options.currencySymbol + options.currencyDelimiter + result;
	            }
	            else {
	                result += options.currencyDelimiter + options.currencySymbol;
	            }
	        }

	        return result;
	    },
	    getOpenXmlCurrencyFormat: function(currency) {
	        var options = this._getCurrencyOptions(currency);
	        return this._createOpenXmlCurrencyFormat(options);
	    }
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var objectAssign = __webpack_require__(2);
	var locale = __webpack_require__(4).locale;
	var dateLocalization = __webpack_require__(4).date;
	var firstDayOfWeekData = __webpack_require__(6);

	var getIntlFormatter = function(format) {
	    return (new Intl.DateTimeFormat(locale(), format)).format;
	};

	var removeLeadingZeroes = function(str) {
	    return str.replace(/(\D)0+(\d)/g, '$1$2');
	};
	var dateStringEquals = function(actual, expected) {
	    return removeLeadingZeroes(actual) === removeLeadingZeroes(expected);
	};

	var intlFormats = {
	    day: { day: 'numeric' },
	    dayofweek: { weekday: 'long' },
	    hour: { hour: 'numeric', hour12: false },
	    longdate: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
	    longdatelongtime: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' },
	    longtime: { hour: 'numeric', minute: 'numeric', second: 'numeric' },
	    minute: { minute: 'numeric' },
	    month: { month: 'long' },
	    monthandday: { month: 'long', day: 'numeric' },
	    monthandyear: { year: 'numeric', month: 'long' },
	    shortdate: {},
	    shorttime: { hour: 'numeric', minute: 'numeric' },
	    shortyear: { year: '2-digit' },
	    year: { year: 'numeric' }
	};

	Object.defineProperty(intlFormats, 'shortdateshorttime', {
	    get: function() {
	        var defaultOptions = Intl.DateTimeFormat(locale()).resolvedOptions();

	        return { year: defaultOptions.year, month: defaultOptions.month, day: defaultOptions.day, hour: 'numeric', minute: 'numeric' };
	    }
	});

	var getIntlFomat = function(format) {
	    return typeof format === 'string' && intlFormats[format.toLowerCase()];
	};

	dateLocalization.resetInjection();
	dateLocalization.inject({
	    getMonthNames: function(format) {
	        var intlFormats = {
	            wide: 'long',
	            abbreviated: 'short',
	            narrow: 'narrow'
	        };

	        return Array.apply(null, new Array(12)).map(function(_, monthIndex) {
	            return getIntlFormatter({ month: intlFormats[format || 'wide'] })(new Date(0, monthIndex, 2));
	        });
	    },

	    getDayNames: function(format) {
	        var intlFormats = {
	            wide: 'long',
	            abbreviated: 'short',
	            short: 'narrow',
	            narrow: 'narrow'
	        };

	        var getIntlDayNames = function(format) {
	            return Array.apply(null, new Array(7)).map(function(_, dayIndex) {
	                return getIntlFormatter({ weekday: format, timeZone: 'UTC' })(new Date(Date.UTC(0, 0, dayIndex)));
	            });
	        };

	        var result = getIntlDayNames(intlFormats[format || 'wide']);

	        return result;
	    },

	    format: function(date, format) {
	        if(!date) {
	            return;
	        }

	        if(!format) {
	            return date;
	        }

	        format = format.type || format;

	        var intlFormat = getIntlFomat(format);
	        if(intlFormat) {
	            return getIntlFormatter(intlFormat)(date);
	        }

	        if(format.formatter || typeof format === 'function' || typeof format === 'string') {
	            return this.callBase.apply(this, arguments);
	        }

	        return getIntlFormatter(format)(date);
	    },

	    parse: function(dateString, format) {
	        var SIMPLE_FORMATS = ['shortdate', 'shorttime', 'shortdateshorttime', 'longtime'];
	        if(typeof format === 'string' && SIMPLE_FORMATS.indexOf(format.toLowerCase()) > -1) {
	            return this._parseDateBySimpleFormat(dateString, format.toLowerCase());
	        }

	        return this.callBase(dateString, format);
	    },

	    _parseDateBySimpleFormat: function(dateString, format) {
	        var formatParts = this.getFormatParts(format);
	        var dateParts = dateString
	            .split(/\D+/)
	            .filter(function(part) { return part.length > 0; });

	        if(formatParts.length !== dateParts.length) {
	            return;
	        }

	        var dateArgs = this._generateDateArgs(dateString, formatParts, dateParts);

	        var constructDate = function(dateArgs, ampmShift) {
	            var hoursShift = ampmShift ? 12 : 0;
	            return new Date(dateArgs.year, dateArgs.month, dateArgs.day, (dateArgs.hours + hoursShift) % 24, dateArgs.minutes, dateArgs.seconds);
	        };
	        var constructValidDate = function(ampmShift) {
	            var parsedDate = constructDate(dateArgs, ampmShift);
	            if(dateStringEquals(this.format(parsedDate, format), dateString)) {
	                return parsedDate;
	            }
	        }.bind(this);

	        return constructValidDate(false) || constructValidDate(true);
	    },

	    _generateDateArgs: function(dateString, formatParts, dateParts) {
	        var currentDate = new Date();
	        var dateArgs = {
	            year: currentDate.getFullYear(),
	            month: currentDate.getMonth(),
	            day: currentDate.getDate(),
	            hours: 0,
	            minutes: 0,
	            seconds: 0
	        };

	        formatParts.forEach(function(formatPart, index) {
	            var datePart = dateParts[index];
	            var parsed = parseInt(datePart, 10);

	            if(formatPart === 'month') {
	                parsed = parsed - 1;
	            }

	            dateArgs[formatPart] = parsed;
	        });

	        return dateArgs;
	    },

	    formatUsesMonthName: function(format) {
	        if(typeof format === 'object' && !(format.type || format.format)) {
	            return format.month === 'long';
	        }

	        return this.callBase.apply(this, arguments);
	    },

	    formatUsesDayName: function(format) {
	        if(typeof format === 'object' && !(format.type || format.format)) {
	            return format.weekday === 'long';
	        }

	        return this.callBase.apply(this, arguments);
	    },

	    getFormatParts: function(format) {
	        var utcFormat = objectAssign({}, intlFormats[format.toLowerCase()], { timeZone: 'UTC' });
	        var utcDate = new Date(Date.UTC(2001, 2, 4, 5, 6, 7));
	        var formattedDate = getIntlFormatter(utcFormat)(utcDate);

	        var formatParts = [
	            { name: 'year', value: 1 },
	            { name: 'month', value: 3 },
	            { name: 'day', value: 4 },
	            { name: 'hours', value: 5 },
	            { name: 'minutes', value: 6 },
	            { name: 'seconds', value: 7 }
	        ];

	        return formatParts
	            .map(function(part) {
	                return {
	                    name: part.name,
	                    index: formattedDate.indexOf(part.value)
	                };
	            })
	            .filter(function(part) { return part.index > -1; })
	            .sort(function(a, b) { return a.index - b.index; })
	            .map(function(part) { return part.name; });
	    },

	    firstDayOfWeekIndex: function() {
	        var index = firstDayOfWeekData[locale()];

	        return index === undefined ? 1 : index;
	    }
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	    "af": 0,
	    "am": 0,
	    "ar": 6,
	    "ar-AE": 6,
	    "ar-BH": 6,
	    "ar-DJ": 6,
	    "ar-DZ": 6,
	    "ar-EG": 6,
	    "ar-IL": 0,
	    "ar-IQ": 6,
	    "ar-JO": 6,
	    "ar-KW": 6,
	    "ar-LY": 6,
	    "ar-MA": 6,
	    "ar-OM": 6,
	    "ar-QA": 6,
	    "ar-SA": 0,
	    "ar-SD": 6,
	    "ar-SY": 6,
	    "ar-TN": 0,
	    "ar-YE": 0,
	    "as": 0,
	    "bn": 5,
	    "bn-IN": 0,
	    "bo": 0,
	    "bo-IN": 0,
	    "brx": 0,
	    "chr": 0,
	    "ckb": 6,
	    "ckb-IR": 6,
	    "dav": 0,
	    "dz": 0,
	    "ebu": 0,
	    "en": 0,
	    "en-AG": 0,
	    "en-AS": 0,
	    "en-AU": 0,
	    "en-BS": 0,
	    "en-BW": 0,
	    "en-BZ": 0,
	    "en-CA": 0,
	    "en-DM": 0,
	    "en-GU": 0,
	    "en-HK": 0,
	    "en-IE": 0,
	    "en-IL": 0,
	    "en-IN": 0,
	    "en-JM": 0,
	    "en-KE": 0,
	    "en-MH": 0,
	    "en-MO": 0,
	    "en-MT": 0,
	    "en-NZ": 0,
	    "en-PH": 0,
	    "en-PK": 0,
	    "en-PR": 0,
	    "en-SD": 6,
	    "en-SG": 0,
	    "en-TT": 0,
	    "en-UM": 0,
	    "en-US-POSIX": 0,
	    "en-VI": 0,
	    "en-WS": 0,
	    "en-ZA": 0,
	    "en-ZW": 0,
	    "es-AR": 0,
	    "es-BR": 0,
	    "es-CO": 0,
	    "es-DO": 0,
	    "es-GT": 0,
	    "es-HN": 0,
	    "es-MX": 0,
	    "es-NI": 0,
	    "es-PA": 0,
	    "es-PE": 0,
	    "es-PH": 0,
	    "es-PR": 0,
	    "es-PY": 0,
	    "es-SV": 0,
	    "es-US": 0,
	    "es-VE": 0,
	    "fa": 6,
	    "fa-AF": 6,
	    "fil": 0,
	    "fr-CA": 0,
	    "fr-DJ": 6,
	    "fr-DZ": 6,
	    "fr-MA": 6,
	    "fr-SY": 6,
	    "fr-TN": 0,
	    "ga": 0,
	    "gu": 0,
	    "guz": 0,
	    "haw": 0,
	    "he": 0,
	    "hi": 0,
	    "id": 0,
	    "ii": 0,
	    "ja": 0,
	    "kab": 6,
	    "kam": 0,
	    "ki": 0,
	    "kln": 0,
	    "km": 0,
	    "kn": 0,
	    "ko": 0,
	    "kok": 0,
	    "ks": 0,
	    "lkt": 0,
	    "lo": 0,
	    "lrc": 6,
	    "lrc-IQ": 6,
	    "luo": 0,
	    "luy": 0,
	    "mas": 0,
	    "mer": 0,
	    "mgh": 0,
	    "ml": 0,
	    "mr": 0,
	    "ms-SG": 0,
	    "mt": 0,
	    "my": 0,
	    "mzn": 6,
	    "nd": 0,
	    "ne": 0,
	    "ne-IN": 0,
	    "om": 0,
	    "om-KE": 0,
	    "or": 0,
	    "pa": 0,
	    "pa-Arab": 0,
	    "pa-Guru": 0,
	    "ps": 6,
	    "pt": 0,
	    "pt-MO": 0,
	    "pt-MZ": 0,
	    "qu": 0,
	    "root": 0,
	    "saq": 0,
	    "seh": 0,
	    "shi": 6,
	    "shi-Latn": 6,
	    "shi-Tfng": 6,
	    "sn": 0,
	    "so-DJ": 6,
	    "so-ET": 0,
	    "so-KE": 0,
	    "sw-KE": 0,
	    "ta": 0,
	    "ta-SG": 0,
	    "te": 0,
	    "teo-KE": 0,
	    "th": 0,
	    "ti": 0,
	    "tzm": 6,
	    "ug": 0,
	    "ur": 0,
	    "ur-IN": 0,
	    "uz-Arab": 6,
	    "yue": 0,
	    "zgh": 6,
	    "zh": 0,
	    "zh-Hans": 0,
	    "zh-Hans-HK": 0,
	    "zh-Hans-MO": 0,
	    "zh-Hans-SG": 0,
	    "zh-Hant": 0,
	    "zh-Hant-HK": 0,
	    "zh-Hant-MO": 0,
	    "zu": 0
	};

/***/ }
/******/ ])
});
;