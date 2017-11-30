(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["awFquery"] = factory();
	else
		root["awFquery"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var create_fquery_delegator = function(name) {
    return function() {
        var args = arguments;
        return function(item) {
            return item[name].apply(item, args);
        };
    };
};

var fquerybuilder = function(key_name, base, config) {

    var fquery = {
        flat: !key_name,
        key_name: key_name || "___",
        base: base,
        processors: [],
        result: [],
        config: config || {},
        lock: false
    };

    fquery.not = function(condition) {
        return function(item) {
            return !condition(item);
        };
    };

    fquery.prepare = function(func) {
        fquery.prepare_handler = func;
        return fquery;
    };

    fquery.enter = function(condition, action) {
        var processor = {
            condition: condition,
            action: action
        };
        fquery.processors.push(processor);
        return fquery;
    };

    fquery.exit = function(func) {
        fquery.exit_handler = func;
        return fquery;
    };

    fquery.end = function(func) {
        fquery.end_handler = func;
        return fquery;
    };

    fquery.select = function(key) {
        var selection;
        for (var i = 0; i < fquery.result.length; i++) {
            if (fquery.result[i][fquery.key_name] === key) {
                selection = fquery.result[i];
            }
        }

        if (selection === undefined) {
            var item = {};
            item[fquery.key_name] = key;
            for (var prop in base) {
                item[prop] = base[prop];
            }
            fquery.result.push(item);
            fquery.last_selection = item;
            return item;
        } else {
            fquery.last_selection = selection;
            return selection;
        }
    };

    fquery.count = function(counter_name, condition, key, lock) {
        fquery.enter(condition, function(item, fq) {
            var selector = fq.select(key);
            if (!selector.hasOwnProperty(counter_name)) {
                selector[counter_name] = 0;
            }
            selector[counter_name]++;
            if (lock) {
                fquery.lock = true;
            }
        });
        return fquery;
    };

    fquery.run = function(data, override_config) {
        var config = override_config || fquery.config;
        fquery.index = -1;
        fquery.source = data;
        fquery.result = [];
        fquery.last_selection = undefined;
        if (fquery.prepare_handler) {
            fquery.prepare_handler(fquery);
        }
        data.forEach(function(item) {
            fquery.index++;
            fquery.processors.forEach(function(processor) {
                if (!fquery.lock && (processor.condition === true || processor.condition(item))) {
                    processor.action(item, fquery);
                }
            });
            fquery.lock = false;
        });

        if (fquery.exit_handler) {
            fquery.result.forEach(function(item) {
                fquery.exit_handler(item, fquery);
            });
        }

        if (config.sort_by) {
            var sort_prop = config.sort_by;
            fquery.result.sort(function(a, b) {
                return config.asc ? a[sort_prop] - b[sort_prop] : b[sort_prop] - a[sort_prop];
            });
        }

        if (fquery.end_handler) {
            fquery.end_handler(fquery.result, fquery);
        }

        return fquery.flat && fquery.result.length ? fquery.result[0] : fquery.result;
    };
    
    return fquery;
};


function create(helpers) {
    var fquery = {ops: {}};

    for (var name in helpers.operators) {
        fquery.ops[name] = create_fquery_delegator(name);
    }

    fquery.factory = fquerybuilder;
    return fquery;
}


module.exports = create;

/***/ })
/******/ ]);
});