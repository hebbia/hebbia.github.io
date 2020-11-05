(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sentence_splitter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// MIT © 2017 azu
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTNodeTypes = void 0;
var ASTNodeTypes;
(function (ASTNodeTypes) {
    ASTNodeTypes["Document"] = "Document";
    ASTNodeTypes["DocumentExit"] = "Document:exit";
    ASTNodeTypes["Paragraph"] = "Paragraph";
    ASTNodeTypes["ParagraphExit"] = "Paragraph:exit";
    ASTNodeTypes["BlockQuote"] = "BlockQuote";
    ASTNodeTypes["BlockQuoteExit"] = "BlockQuote:exit";
    ASTNodeTypes["ListItem"] = "ListItem";
    ASTNodeTypes["ListItemExit"] = "ListItem:exit";
    ASTNodeTypes["List"] = "List";
    ASTNodeTypes["ListExit"] = "List:exit";
    ASTNodeTypes["Header"] = "Header";
    ASTNodeTypes["HeaderExit"] = "Header:exit";
    ASTNodeTypes["CodeBlock"] = "CodeBlock";
    ASTNodeTypes["CodeBlockExit"] = "CodeBlock:exit";
    ASTNodeTypes["HtmlBlock"] = "HtmlBlock";
    ASTNodeTypes["HtmlBlockExit"] = "HtmlBlock:exit";
    ASTNodeTypes["ReferenceDef"] = "ReferenceDef";
    ASTNodeTypes["ReferenceDefExit"] = "ReferenceDef:exit";
    ASTNodeTypes["HorizontalRule"] = "HorizontalRule";
    ASTNodeTypes["HorizontalRuleExit"] = "HorizontalRule:exit";
    ASTNodeTypes["Comment"] = "Comment";
    ASTNodeTypes["CommentExit"] = "Comment:exit";
    // inline
    ASTNodeTypes["Str"] = "Str";
    ASTNodeTypes["StrExit"] = "Str:exit";
    ASTNodeTypes["Break"] = "Break";
    ASTNodeTypes["BreakExit"] = "Break:exit";
    ASTNodeTypes["Emphasis"] = "Emphasis";
    ASTNodeTypes["EmphasisExit"] = "Emphasis:exit";
    ASTNodeTypes["Strong"] = "Strong";
    ASTNodeTypes["StrongExit"] = "Strong:exit";
    ASTNodeTypes["Html"] = "Html";
    ASTNodeTypes["HtmlExit"] = "Html:exit";
    ASTNodeTypes["Link"] = "Link";
    ASTNodeTypes["LinkExit"] = "Link:exit";
    ASTNodeTypes["Image"] = "Image";
    ASTNodeTypes["ImageExit"] = "Image:exit";
    ASTNodeTypes["Code"] = "Code";
    ASTNodeTypes["CodeExit"] = "Code:exit";
    ASTNodeTypes["Delete"] = "Delete";
    ASTNodeTypes["DeleteExit"] = "Delete:exit";
})(ASTNodeTypes = exports.ASTNodeTypes || (exports.ASTNodeTypes = {}));

},{}],2:[function(require,module,exports){
"use strict";

/*
  Copyright (C) 2014 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function compare(v1, v2) {
  return v1 < v2;
}

function upperBound(array, value, comp) {
  if (comp === undefined) comp = compare;
  return (function () {
    var len = array.length;
    var i = 0;

    while (len) {
      var diff = len >>> 1;
      var cursor = i + diff;
      if (comp(value, array[cursor])) {
        len = diff;
      } else {
        i = cursor + 1;
        len -= diff + 1;
      }
    }
    return i;
  })();
}

function lowerBound(array, value, comp) {
  if (comp === undefined) comp = compare;
  return (function () {
    var len = array.length;
    var i = 0;

    while (len) {
      var diff = len >>> 1;
      var cursor = i + diff;
      if (comp(array[cursor], value)) {
        i = cursor + 1;
        len -= diff + 1;
      } else {
        len = diff;
      }
    }
    return i;
  })();
}

function binarySearch(array, value, comp) {
  if (comp === undefined) comp = compare;
  return (function () {
    var cursor = lowerBound(array, value, comp);
    return cursor !== array.length && !comp(value, array[cursor]);
  })();
}

exports.compare = compare;
exports.lowerBound = lowerBound;
exports.upperBound = upperBound;
exports.binarySearch = binarySearch;

},{}],3:[function(require,module,exports){
'use strict';

var keys = require('object-keys');
var hasSymbols = typeof Symbol === 'function' && typeof Symbol('foo') === 'symbol';

var toStr = Object.prototype.toString;
var concat = Array.prototype.concat;
var origDefineProperty = Object.defineProperty;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		origDefineProperty(obj, 'x', { enumerable: false, value: obj });
		// eslint-disable-next-line no-unused-vars, no-restricted-syntax
		for (var _ in obj) { // jscs:ignore disallowUnusedVariables
			return false;
		}
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = origDefineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		origDefineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = keys(map);
	if (hasSymbols) {
		props = concat.call(props, Object.getOwnPropertySymbols(map));
	}
	for (var i = 0; i < props.length; i += 1) {
		defineProperty(object, props[i], map[props[i]], predicates[props[i]]);
	}
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

module.exports = defineProperties;

},{"object-keys":15}],4:[function(require,module,exports){
'use strict';

module.exports = require('../5/CheckObjectCoercible');

},{"../5/CheckObjectCoercible":5}],5:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

// http://www.ecma-international.org/ecma-262/5.1/#sec-9.10

module.exports = function CheckObjectCoercible(value, optMessage) {
	if (value == null) {
		throw new $TypeError(optMessage || ('Cannot call method on ' + value));
	}
	return value;
};

},{"../GetIntrinsic":6}],6:[function(require,module,exports){
'use strict';

/* globals
	Atomics,
	SharedArrayBuffer,
*/

var undefined;

var $TypeError = TypeError;

var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
	try {
		$gOPD({}, '');
	} catch (e) {
		$gOPD = null; // this is IE 8, which has a broken gOPD
	}
}

var throwTypeError = function () { throw new $TypeError(); };
var ThrowTypeError = $gOPD
	? (function () {
		try {
			// eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
			arguments.callee; // IE 8 does not throw here
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				// IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
				return $gOPD(arguments, 'callee').get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}())
	: throwTypeError;

var hasSymbols = require('has-symbols')();

var getProto = Object.getPrototypeOf || function (x) { return x.__proto__; }; // eslint-disable-line no-proto

var generator; // = function * () {};
var generatorFunction = generator ? getProto(generator) : undefined;
var asyncFn; // async function() {};
var asyncFunction = asyncFn ? asyncFn.constructor : undefined;
var asyncGen; // async function * () {};
var asyncGenFunction = asyncGen ? getProto(asyncGen) : undefined;
var asyncGenIterator = asyncGen ? asyncGen() : undefined;

var TypedArray = typeof Uint8Array === 'undefined' ? undefined : getProto(Uint8Array);

var INTRINSICS = {
	'%Array%': Array,
	'%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
	'%ArrayBufferPrototype%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer.prototype,
	'%ArrayIteratorPrototype%': hasSymbols ? getProto([][Symbol.iterator]()) : undefined,
	'%ArrayPrototype%': Array.prototype,
	'%ArrayProto_entries%': Array.prototype.entries,
	'%ArrayProto_forEach%': Array.prototype.forEach,
	'%ArrayProto_keys%': Array.prototype.keys,
	'%ArrayProto_values%': Array.prototype.values,
	'%AsyncFromSyncIteratorPrototype%': undefined,
	'%AsyncFunction%': asyncFunction,
	'%AsyncFunctionPrototype%': asyncFunction ? asyncFunction.prototype : undefined,
	'%AsyncGenerator%': asyncGen ? getProto(asyncGenIterator) : undefined,
	'%AsyncGeneratorFunction%': asyncGenFunction,
	'%AsyncGeneratorPrototype%': asyncGenFunction ? asyncGenFunction.prototype : undefined,
	'%AsyncIteratorPrototype%': asyncGenIterator && hasSymbols && Symbol.asyncIterator ? asyncGenIterator[Symbol.asyncIterator]() : undefined,
	'%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
	'%Boolean%': Boolean,
	'%BooleanPrototype%': Boolean.prototype,
	'%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
	'%DataViewPrototype%': typeof DataView === 'undefined' ? undefined : DataView.prototype,
	'%Date%': Date,
	'%DatePrototype%': Date.prototype,
	'%decodeURI%': decodeURI,
	'%decodeURIComponent%': decodeURIComponent,
	'%encodeURI%': encodeURI,
	'%encodeURIComponent%': encodeURIComponent,
	'%Error%': Error,
	'%ErrorPrototype%': Error.prototype,
	'%eval%': eval, // eslint-disable-line no-eval
	'%EvalError%': EvalError,
	'%EvalErrorPrototype%': EvalError.prototype,
	'%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
	'%Float32ArrayPrototype%': typeof Float32Array === 'undefined' ? undefined : Float32Array.prototype,
	'%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
	'%Float64ArrayPrototype%': typeof Float64Array === 'undefined' ? undefined : Float64Array.prototype,
	'%Function%': Function,
	'%FunctionPrototype%': Function.prototype,
	'%Generator%': generator ? getProto(generator()) : undefined,
	'%GeneratorFunction%': generatorFunction,
	'%GeneratorPrototype%': generatorFunction ? generatorFunction.prototype : undefined,
	'%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
	'%Int8ArrayPrototype%': typeof Int8Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
	'%Int16ArrayPrototype%': typeof Int16Array === 'undefined' ? undefined : Int8Array.prototype,
	'%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
	'%Int32ArrayPrototype%': typeof Int32Array === 'undefined' ? undefined : Int32Array.prototype,
	'%isFinite%': isFinite,
	'%isNaN%': isNaN,
	'%IteratorPrototype%': hasSymbols ? getProto(getProto([][Symbol.iterator]())) : undefined,
	'%JSON%': typeof JSON === 'object' ? JSON : undefined,
	'%JSONParse%': typeof JSON === 'object' ? JSON.parse : undefined,
	'%Map%': typeof Map === 'undefined' ? undefined : Map,
	'%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols ? undefined : getProto(new Map()[Symbol.iterator]()),
	'%MapPrototype%': typeof Map === 'undefined' ? undefined : Map.prototype,
	'%Math%': Math,
	'%Number%': Number,
	'%NumberPrototype%': Number.prototype,
	'%Object%': Object,
	'%ObjectPrototype%': Object.prototype,
	'%ObjProto_toString%': Object.prototype.toString,
	'%ObjProto_valueOf%': Object.prototype.valueOf,
	'%parseFloat%': parseFloat,
	'%parseInt%': parseInt,
	'%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
	'%PromisePrototype%': typeof Promise === 'undefined' ? undefined : Promise.prototype,
	'%PromiseProto_then%': typeof Promise === 'undefined' ? undefined : Promise.prototype.then,
	'%Promise_all%': typeof Promise === 'undefined' ? undefined : Promise.all,
	'%Promise_reject%': typeof Promise === 'undefined' ? undefined : Promise.reject,
	'%Promise_resolve%': typeof Promise === 'undefined' ? undefined : Promise.resolve,
	'%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
	'%RangeError%': RangeError,
	'%RangeErrorPrototype%': RangeError.prototype,
	'%ReferenceError%': ReferenceError,
	'%ReferenceErrorPrototype%': ReferenceError.prototype,
	'%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
	'%RegExp%': RegExp,
	'%RegExpPrototype%': RegExp.prototype,
	'%Set%': typeof Set === 'undefined' ? undefined : Set,
	'%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols ? undefined : getProto(new Set()[Symbol.iterator]()),
	'%SetPrototype%': typeof Set === 'undefined' ? undefined : Set.prototype,
	'%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
	'%SharedArrayBufferPrototype%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer.prototype,
	'%String%': String,
	'%StringIteratorPrototype%': hasSymbols ? getProto(''[Symbol.iterator]()) : undefined,
	'%StringPrototype%': String.prototype,
	'%Symbol%': hasSymbols ? Symbol : undefined,
	'%SymbolPrototype%': hasSymbols ? Symbol.prototype : undefined,
	'%SyntaxError%': SyntaxError,
	'%SyntaxErrorPrototype%': SyntaxError.prototype,
	'%ThrowTypeError%': ThrowTypeError,
	'%TypedArray%': TypedArray,
	'%TypedArrayPrototype%': TypedArray ? TypedArray.prototype : undefined,
	'%TypeError%': $TypeError,
	'%TypeErrorPrototype%': $TypeError.prototype,
	'%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
	'%Uint8ArrayPrototype%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array.prototype,
	'%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
	'%Uint8ClampedArrayPrototype%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray.prototype,
	'%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
	'%Uint16ArrayPrototype%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array.prototype,
	'%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
	'%Uint32ArrayPrototype%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array.prototype,
	'%URIError%': URIError,
	'%URIErrorPrototype%': URIError.prototype,
	'%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
	'%WeakMapPrototype%': typeof WeakMap === 'undefined' ? undefined : WeakMap.prototype,
	'%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
	'%WeakSetPrototype%': typeof WeakSet === 'undefined' ? undefined : WeakSet.prototype
};

var bind = require('function-bind');
var $replace = bind.call(Function.call, String.prototype.replace);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
	var result = [];
	$replace(string, rePropName, function (match, number, quote, subString) {
		result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : (number || match);
	});
	return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
	if (!(name in INTRINSICS)) {
		throw new SyntaxError('intrinsic ' + name + ' does not exist!');
	}

	// istanbul ignore if // hopefully this is impossible to test :-)
	if (typeof INTRINSICS[name] === 'undefined' && !allowMissing) {
		throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
	}

	return INTRINSICS[name];
};

module.exports = function GetIntrinsic(name, allowMissing) {
	if (typeof name !== 'string' || name.length === 0) {
		throw new TypeError('intrinsic name must be a non-empty string');
	}
	if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
		throw new TypeError('"allowMissing" argument must be a boolean');
	}

	var parts = stringToPath(name);

	var value = getBaseIntrinsic('%' + (parts.length > 0 ? parts[0] : '') + '%', allowMissing);
	for (var i = 1; i < parts.length; i += 1) {
		if (value != null) {
			if ($gOPD && (i + 1) >= parts.length) {
				var desc = $gOPD(value, parts[i]);
				if (!allowMissing && !(parts[i] in value)) {
					throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
				}
				value = desc ? (desc.get || desc.value) : value[parts[i]];
			} else {
				value = value[parts[i]];
			}
		}
	}
	return value;
};

},{"function-bind":10,"has-symbols":11}],7:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

var GetIntrinsic = require('../GetIntrinsic');

var $apply = GetIntrinsic('%Function.prototype.apply%');
var $call = GetIntrinsic('%Function.prototype.call%');
var $reflectApply = GetIntrinsic('%Reflect.apply%', true) || bind.call($call, $apply);

module.exports = function callBind() {
	return $reflectApply(bind, $call, arguments);
};

module.exports.apply = function applyBind() {
	return $reflectApply(bind, $apply, arguments);
};

},{"../GetIntrinsic":6,"function-bind":10}],8:[function(require,module,exports){
'use strict';

var GetIntrinsic = require('../GetIntrinsic');

var callBind = require('./callBind');

var $indexOf = callBind(GetIntrinsic('String.prototype.indexOf'));

module.exports = function callBoundIntrinsic(name, allowMissing) {
	var intrinsic = GetIntrinsic(name, !!allowMissing);
	if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.')) {
		return callBind(intrinsic);
	}
	return intrinsic;
};

},{"../GetIntrinsic":6,"./callBind":7}],9:[function(require,module,exports){
'use strict';

/* eslint no-invalid-this: 1 */

var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var bound;
    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};

},{}],10:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = Function.prototype.bind || implementation;

},{"./implementation":9}],11:[function(require,module,exports){
(function (global){
'use strict';

var origSymbol = global.Symbol;
var hasSymbolSham = require('./shams');

module.exports = function hasNativeSymbols() {
	if (typeof origSymbol !== 'function') { return false; }
	if (typeof Symbol !== 'function') { return false; }
	if (typeof origSymbol('foo') !== 'symbol') { return false; }
	if (typeof Symbol('bar') !== 'symbol') { return false; }

	return hasSymbolSham();
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./shams":12}],12:[function(require,module,exports){
'use strict';

/* eslint complexity: [2, 18], max-statements: [2, 33] */
module.exports = function hasSymbols() {
	if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') { return false; }
	if (typeof Symbol.iterator === 'symbol') { return true; }

	var obj = {};
	var sym = Symbol('test');
	var symObj = Object(sym);
	if (typeof sym === 'string') { return false; }

	if (Object.prototype.toString.call(sym) !== '[object Symbol]') { return false; }
	if (Object.prototype.toString.call(symObj) !== '[object Symbol]') { return false; }

	// temp disabled per https://github.com/ljharb/object.assign/issues/17
	// if (sym instanceof Symbol) { return false; }
	// temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
	// if (!(symObj instanceof Symbol)) { return false; }

	// if (typeof Symbol.prototype.toString !== 'function') { return false; }
	// if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

	var symVal = 42;
	obj[sym] = symVal;
	for (sym in obj) { return false; } // eslint-disable-line no-restricted-syntax
	if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) { return false; }

	if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) { return false; }

	var syms = Object.getOwnPropertySymbols(obj);
	if (syms.length !== 1 || syms[0] !== sym) { return false; }

	if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) { return false; }

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
		var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
		if (descriptor.value !== symVal || descriptor.enumerable !== true) { return false; }
	}

	return true;
};

},{}],13:[function(require,module,exports){
'use strict';

var bind = require('function-bind');

module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);

},{"function-bind":10}],14:[function(require,module,exports){
'use strict';

var keysShim;
if (!Object.keys) {
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isArgs = require('./isArguments'); // eslint-disable-line global-require
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$applicationCache: true,
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$onmozfullscreenchange: true,
		$onmozfullscreenerror: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];

		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}

		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}
module.exports = keysShim;

},{"./isArguments":16}],15:[function(require,module,exports){
'use strict';

var slice = Array.prototype.slice;
var isArgs = require('./isArguments');

var origKeys = Object.keys;
var keysShim = origKeys ? function keys(o) { return origKeys(o); } : require('./implementation');

var originalKeys = Object.keys;

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			var args = Object.keys(arguments);
			return args && args.length === arguments.length;
		}(1, 2));
		if (!keysWorksWithArguments) {
			Object.keys = function keys(object) { // eslint-disable-line func-name-matching
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				}
				return originalKeys(object);
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;

},{"./implementation":14,"./isArguments":16}],16:[function(require,module,exports){
'use strict';

var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

},{}],17:[function(require,module,exports){
'use strict';

var has = require('has');
var RequireObjectCoercible = require('es-abstract/2019/RequireObjectCoercible');
var callBound = require('es-abstract/helpers/callBound');

var $isEnumerable = callBound('Object.prototype.propertyIsEnumerable');

module.exports = function values(O) {
	var obj = RequireObjectCoercible(O);
	var vals = [];
	for (var key in obj) {
		if (has(obj, key) && $isEnumerable(obj, key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};

},{"es-abstract/2019/RequireObjectCoercible":4,"es-abstract/helpers/callBound":8,"has":13}],18:[function(require,module,exports){
'use strict';

var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var shim = require('./shim');

var polyfill = getPolyfill();

define(polyfill, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = polyfill;

},{"./implementation":17,"./polyfill":19,"./shim":20,"define-properties":3}],19:[function(require,module,exports){
'use strict';

var implementation = require('./implementation');

module.exports = function getPolyfill() {
	return typeof Object.values === 'function' ? Object.values : implementation;
};

},{"./implementation":17}],20:[function(require,module,exports){
'use strict';

var getPolyfill = require('./polyfill');
var define = require('define-properties');

module.exports = function shimValues() {
	var polyfill = getPolyfill();
	define(Object, { values: polyfill }, {
		values: function testValues() {
			return Object.values !== polyfill;
		}
	});
	return polyfill;
};

},{"./polyfill":19,"define-properties":3}],21:[function(require,module,exports){
(function (process){
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
function debugLog() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (process.env.DEBUG !== "sentence-splitter") {
        return;
    }
    console.log.apply(console, __spreadArrays(["sentence-splitter: "], args));
}
exports.debugLog = debugLog;

}).call(this,require('_process'))
},{"_process":34}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var English_1 = require("./lang/English");
var isCapitalized = function (text) {
    if (!text || text.length === 0) {
        return false;
    }
    return /^[A-Z]/.test(text);
};
var compareNoCaseSensitive = function (a, b) {
    return a.toLowerCase() === b.toLowerCase();
};
/**
 * abbreviation marker
 */
var AbbrMarker = /** @class */ (function () {
    function AbbrMarker(lang) {
        if (lang === void 0) { lang = English_1.English; }
        this.lang = lang;
    }
    /**
     * Get Word
     * word should have left space and right space,
     * @param {SourceCode} sourceCode
     * @param {number} startIndex
     * @returns {string}
     */
    AbbrMarker.prototype.getWord = function (sourceCode, startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        var whiteSpace = /\s/;
        var prevChar = sourceCode.read(-1);
        if (prevChar && !whiteSpace.test(prevChar)) {
            return "";
        }
        var word = "";
        var count = startIndex;
        var char = "";
        while ((char = sourceCode.read(count))) {
            if (whiteSpace.test(char)) {
                break;
            }
            word += char;
            count++;
        }
        return word;
    };
    AbbrMarker.prototype.getPrevWord = function (sourceCode) {
        var whiteSpace = /\s/;
        var count = -1;
        var char = "";
        while ((char = sourceCode.read(count))) {
            if (!whiteSpace.test(char)) {
                break;
            }
            count--;
        }
        while ((char = sourceCode.read(count))) {
            if (whiteSpace.test(char)) {
                break;
            }
            count--;
        }
        return this.getWord(sourceCode, count + 1);
    };
    AbbrMarker.prototype.mark = function (sourceCode) {
        if (sourceCode.isInContextRange()) {
            return;
        }
        var currentWord = this.getWord(sourceCode);
        if (currentWord.length === 0) {
            return;
        }
        // Allow: Multi-period abbr
        // Example: U.S.A
        if (/^([a-zA-Z]\.){3,}$/.test(currentWord)) {
            return sourceCode.markContextRange([sourceCode.offset, sourceCode.offset + currentWord.length]);
        }
        // EXCALAMATION_WORDS
        // Example: Yahoo!
        var isMatchedEXCALAMATION_WORDS = this.lang.EXCALAMATION_WORDS.some(function (abbr) {
            return compareNoCaseSensitive(abbr, currentWord);
        });
        if (isMatchedEXCALAMATION_WORDS) {
            return sourceCode.markContextRange([sourceCode.offset, sourceCode.offset + currentWord.length]);
        }
        // PREPOSITIVE_ABBREVIATIONS
        // Example: Mr. Fuji
        var isMatchedPREPOSITIVE_ABBREVIATIONS = this.lang.PREPOSITIVE_ABBREVIATIONS.some(function (abbr) {
            return compareNoCaseSensitive(abbr, currentWord);
        });
        if (isMatchedPREPOSITIVE_ABBREVIATIONS) {
            return sourceCode.markContextRange([sourceCode.offset, sourceCode.offset + currentWord.length]);
        }
        // ABBREVIATIONS
        var isMatched = this.lang.ABBREVIATIONS.some(function (abbr) {
            return compareNoCaseSensitive(abbr, currentWord);
        });
        var prevWord = this.getPrevWord(sourceCode);
        var nextWord = this.getWord(sourceCode, currentWord.length + 1);
        // console.log("prevWord", prevWord);
        // console.log("currentWord", currentWord);
        // console.log("nextWord", nextWord);
        // Special case: Capital <ABBR>. Capital
        // Example: `I` as a sentence boundary and `I` as an abbreviation
        // > We make a good team, you and I. Did you see Albert I. Jones yesterday?
        if (isCapitalized(prevWord) && /[A-Z]\./.test(currentWord) && isCapitalized(nextWord)) {
            sourceCode.markContextRange([sourceCode.offset, sourceCode.offset + currentWord.length]);
        }
        else if (isMatched && !isCapitalized(nextWord)) {
            // Exception. This allow to write Capitalized word at next word
            // A.M. is store.
            sourceCode.markContextRange([sourceCode.offset, sourceCode.offset + currentWord.length]);
        }
    };
    return AbbrMarker;
}());
exports.AbbrMarker = AbbrMarker;

},{"./lang/English":29}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Any value without `parsers`
 */
var AnyValueParser = /** @class */ (function () {
    /**
     * Eat any value without `parsers.test`
     */
    function AnyValueParser(options) {
        this.parsers = options.parsers;
        this.markers = options.markers;
    }
    AnyValueParser.prototype.test = function (sourceCode) {
        if (sourceCode.hasEnd) {
            return false;
        }
        return this.parsers.every(function (parser) { return !parser.test(sourceCode); });
    };
    AnyValueParser.prototype.seek = function (sourceCode) {
        var currentNode = sourceCode.readNode();
        if (!currentNode) {
            // Text mode
            while (this.test(sourceCode)) {
                this.markers.forEach(function (marker) { return marker.mark(sourceCode); });
                sourceCode.peek();
            }
            return;
        }
        // node - should not over next node
        var isInCurrentNode = function () {
            var currentOffset = sourceCode.offset;
            return currentNode.range[0] <= currentOffset && currentOffset < currentNode.range[1];
        };
        while (isInCurrentNode() && this.test(sourceCode)) {
            this.markers.forEach(function (marker) { return marker.mark(sourceCode); });
            sourceCode.peek();
        }
    };
    return AnyValueParser;
}());
exports.AnyValueParser = AnyValueParser;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * New Line Parser
 */
var NewLineParser = /** @class */ (function () {
    function NewLineParser() {
    }
    NewLineParser.prototype.test = function (sourceCode) {
        var string = sourceCode.read();
        if (!string) {
            return false;
        }
        return /[\r\n]/.test(string);
    };
    NewLineParser.prototype.seek = function (sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    };
    return NewLineParser;
}());
exports.NewLineParser = NewLineParser;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../logger");
var values = require("object.values");
/**
 * Mark pair character
 * PairMarker aim to mark pair string as a single sentence.
 *
 * For example, Following sentence has two period(。). but it should treat a single sentence
 *
 * > I hear "I'm back to home." from radio.
 *
 */
var PairMaker = /** @class */ (function () {
    function PairMaker() {
        var _a;
        this.pairs = (_a = {},
            _a["\""] = "\"",
            _a["\u300C"] = "\u300D",
            _a["\uFF08"] = "\uFF09",
            _a["("] = ")",
            _a["\u300E"] = "\u300F",
            _a["\u3010"] = "\u3011",
            _a["\u300A"] = "\u300B",
            _a);
        this.pairKeys = Object.keys(this.pairs);
        this.pairValues = values(this.pairs);
    }
    PairMaker.prototype.mark = function (sourceCode) {
        var string = sourceCode.read();
        if (!string) {
            return;
        }
        // if current is in a context, should not start other context.
        // PairMaker does not support nest context by design.
        if (!sourceCode.isInContext()) {
            var keyIndex = this.pairKeys.indexOf(string);
            if (keyIndex !== -1) {
                var key = this.pairKeys[keyIndex];
                logger_1.debugLog("PairMaker -> enterContext: " + key);
                sourceCode.enterContext(key);
            }
        }
        else {
            // check that string is end mark?
            var valueIndex = this.pairValues.indexOf(string);
            if (valueIndex !== -1) {
                var key = this.pairKeys[valueIndex];
                logger_1.debugLog("PairMaker -> leaveContext: " + this.pairValues[valueIndex]);
                sourceCode.leaveContext(key);
            }
        }
    };
    return PairMaker;
}());
exports.PairMaker = PairMaker;

},{"../logger":21,"object.values":18}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOptions = {
    separatorCharacters: [
        ".",
        "．",
        "。",
        "?",
        "!",
        "？",
        "！" // (ja) zenkaku exclamation mark
    ]
};
/**
 * Separator parser
 */
var SeparatorParser = /** @class */ (function () {
    function SeparatorParser(options) {
        this.options = options;
        this.separatorCharacters =
            options && options.separatorCharacters ? options.separatorCharacters : exports.DefaultOptions.separatorCharacters;
    }
    SeparatorParser.prototype.test = function (sourceCode) {
        if (sourceCode.isInContext()) {
            return false;
        }
        if (sourceCode.isInContextRange()) {
            return false;
        }
        var firstChar = sourceCode.read();
        var nextChar = sourceCode.read(1);
        if (!firstChar) {
            return false;
        }
        if (!this.separatorCharacters.includes(firstChar)) {
            return false;
        }
        // Need space after period
        // Example: "This is a pen. This is not a pen."
        // It will avoid false-position like `1.23`
        if (firstChar === ".") {
            if (nextChar) {
                return /[\s\t\r\n]/.test(nextChar);
            }
            else {
                return true;
            }
        }
        return true;
    };
    SeparatorParser.prototype.seek = function (sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    };
    return SeparatorParser;
}());
exports.SeparatorParser = SeparatorParser;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StructureSource = require("structured-source");
var SourceCode = /** @class */ (function () {
    function SourceCode(input) {
        this.index = 0;
        this.contexts = [];
        this.contextRanges = [];
        if (typeof input === "string") {
            this.textCharacters = [...input];
            this.source = new StructureSource(input);
            this.startOffset = 0;
            this.firstChildPadding = 0;
        }
        else {
            this.sourceNode = input;
            // When pass AST, fist node may be >=
            // Preserve it as `startOffset`
            this.startOffset = this.sourceNode.range[0];
            // start index is startOffset
            this.index = this.startOffset;
            // before line count of Paragraph node
            var lineBreaks = Array.from(new Array(this.sourceNode.loc.start.line - 1)).fill("\n");
            // filled with dummy text
            var offset = Array.from(new Array(this.startOffset - lineBreaks.length)).fill("∯");
            this.textCharacters = offset.concat(lineBreaks, input.raw.split(""));
            this.source = new StructureSource(this.textCharacters.join(""));
            if (this.sourceNode.children[0]) {
                // Header Node's children does not start with index 0
                // Example: # Header
                // It firstChildPadding is `2`
                this.firstChildPadding = this.sourceNode.children[0].range[0] - this.startOffset;
            }
            else {
                this.firstChildPadding = 0;
            }
        }
    }
    SourceCode.prototype.markContextRange = function (range) {
        this.contextRanges.push(range);
    };
    SourceCode.prototype.isInContextRange = function () {
        var offset = this.offset;
        return this.contextRanges.some(function (range) {
            return range[0] <= offset && offset < range[1];
        });
    };
    SourceCode.prototype.enterContext = function (context) {
        this.contexts.push(context);
    };
    SourceCode.prototype.isInContext = function (context) {
        if (!context) {
            return this.contexts.length > 0;
        }
        return this.contexts.some(function (targetContext) { return targetContext === context; });
    };
    SourceCode.prototype.leaveContext = function (context) {
        var index = this.contexts.lastIndexOf(context);
        if (index !== -1) {
            this.contexts.splice(index, 1);
        }
    };
    Object.defineProperty(SourceCode.prototype, "offset", {
        /**
         * Return current offset value
         * @returns {number}
         */
        get: function () {
            return this.index + this.firstChildPadding;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Return current position object.
     * It includes line, column, offset.
     */
    SourceCode.prototype.now = function () {
        var indexWithChildrenOffset = this.offset;
        var position = this.source.indexToPosition(indexWithChildrenOffset);
        return {
            line: position.line,
            column: position.column,
            offset: indexWithChildrenOffset
        };
    };
    Object.defineProperty(SourceCode.prototype, "hasEnd", {
        /**
         * Return true, no more read char
         */
        get: function () {
            return this.read() === false;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * read char
     * if can not read, return empty string
     * @returns {string}
     */
    SourceCode.prototype.read = function (over) {
        if (over === void 0) { over = 0; }
        var index = this.offset + over;
        if (index < this.startOffset) {
            return false;
        }
        if (0 <= index && index < this.textCharacters.length) {
            return this.textCharacters[index];
        }
        return false;
    };
    /**
     * read node
     * if can not read, return empty string
     * @returns {node}
     */
    SourceCode.prototype.readNode = function (over) {
        if (over === void 0) { over = 0; }
        if (!this.sourceNode) {
            return false;
        }
        var index = this.offset + over;
        if (index < this.startOffset) {
            return false;
        }
        var matchNodeList = this.sourceNode.children.filter(function (node) {
            // <p>[node]</p>
            //         ^
            //        range[1]
            // `< range[1]` prevent infinity loop
            // https://github.com/azu/sentence-splitter/issues/9
            return node.range[0] <= index && index < node.range[1];
        });
        if (matchNodeList.length > 0) {
            // last match
            // because, range is overlap two nodes
            return matchNodeList[matchNodeList.length - 1];
        }
        return false;
    };
    /**
     * Increment current index
     */
    SourceCode.prototype.peek = function () {
        this.index += 1;
    };
    /**
     * Increment node range
     */
    SourceCode.prototype.peekNode = function (node) {
        this.index += node.range[1] - node.range[0];
    };
    /**
     * Seek and Peek
     */
    SourceCode.prototype.seekNext = function (parser) {
        var startPosition = this.now();
        parser.seek(this);
        var endPosition = this.now();
        var value = this.sliceRange(startPosition.offset, endPosition.offset);
        return {
            value: value,
            startPosition: startPosition,
            endPosition: endPosition
        };
    };
    /**
     * Slice text form the range.
     * @param {number} start
     * @param {number} end
     * @returns {string}
     */
    SourceCode.prototype.sliceRange = function (start, end) {
        return this.textCharacters.slice(start, end).join("");
    };
    return SourceCode;
}());
exports.SourceCode = SourceCode;

},{"structured-source":31}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Space parser
 */
var SpaceParser = /** @class */ (function () {
    function SpaceParser() {
    }
    SpaceParser.prototype.test = function (sourceCode) {
        var string = sourceCode.read();
        if (!string) {
            return false;
        }
        return /\s/.test(string);
    };
    SpaceParser.prototype.seek = function (sourceCode) {
        while (this.test(sourceCode)) {
            sourceCode.peek();
        }
    };
    return SpaceParser;
}());
exports.SpaceParser = SpaceParser;

},{}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.English = {
    ABBREVIATIONS: [
        "Adj.",
        "Adm.",
        "Adv.",
        "Al.",
        "Ala.",
        "Alta.",
        "Apr.",
        "Arc.",
        "Ariz.",
        "Ark.",
        "Art.",
        "Assn.",
        "Asst.",
        "Attys.",
        "Aug.",
        "Ave.",
        "Bart.",
        "Bld.",
        "Bldg.",
        "Blvd.",
        "Brig.",
        "Bros.",
        "Btw.",
        "Cal.",
        "Calif.",
        "Capt.",
        "Cl.",
        "Cmdr.",
        "Co.",
        "Col.",
        "Colo.",
        "Comdr.",
        "Con.",
        "Conn.",
        "Corp.",
        "Cpl.",
        "Cres.",
        "Ct.",
        "D.phil.",
        "Dak.",
        "D.C.",
        "Dec.",
        "Del.",
        "Dept.",
        "Det.",
        "Dist.",
        "Dr.",
        "Dr.phil.",
        "Dr.philos.",
        "Drs.",
        "E.g.",
        "Ens.",
        "Esp.",
        "Esq.",
        "Etc.",
        "Exp.",
        "Expy.",
        "Ext.",
        "Feb.",
        "Fed.",
        "Fla.",
        "Ft.",
        "Fwy.",
        "Fy.",
        "Ga.",
        "Gen.",
        "Gov.",
        "Hon.",
        "Hosp.",
        "Hr.",
        "Hway.",
        "Hwy.",
        "I.e.",
        "Ia.",
        "Id.",
        "Ida.",
        "Ill.",
        "Inc.",
        "Ind.",
        "Ing.",
        "Insp.",
        "Is.",
        "Jan.",
        "Jr.",
        "Jul.",
        "Jun.",
        "Kan.",
        "Kans.",
        "Ken.",
        "Ky.",
        "La.",
        "Lt.",
        "Ltd.",
        "Maj.",
        "Man.",
        "Mar.",
        "Mass.",
        "May.",
        "Md.",
        "Me.",
        "Med.",
        "Messrs.",
        "Mex.",
        "Mfg.",
        "Mich.",
        "Min.",
        "Minn.",
        "Miss.",
        "Mlle.",
        "Mm.",
        "Mme.",
        "Mo.",
        "Mont.",
        "Mr.",
        "Mrs.",
        "Ms.",
        "Msgr.",
        "Mssrs.",
        "Mt.",
        "Mtn.",
        "Neb.",
        "Nebr.",
        "Nev.",
        "No.",
        "Nos.",
        "Nov.",
        "Nr.",
        "Oct.",
        "Ok.",
        "Okla.",
        "Ont.",
        "Op.",
        "Ord.",
        "Ore.",
        "P.",
        "Pa.",
        "Pd.",
        "Pde.",
        "Penn.",
        "Penna.",
        "Pfc.",
        "Ph.",
        "Ph.d.",
        "Pl.",
        "Plz.",
        "Pp.",
        "Prof.",
        "Pvt.",
        "Que.",
        "Rd.",
        "Rs.",
        "Ref.",
        "Rep.",
        "Reps.",
        "Res.",
        "Rev.",
        "Rt.",
        "Sask.",
        "Sec.",
        "Sen.",
        "Sens.",
        "Sep.",
        "Sept.",
        "Sfc.",
        "Sgt.",
        "Sr.",
        "St.",
        "Supt.",
        "Surg.",
        "Tce.",
        "Tenn.",
        "Tex.",
        "Univ.",
        "Usafa.",
        "U.S.",
        "Ut.",
        "Va.",
        "V.",
        "Ver.",
        "Vs.",
        "Vt.",
        "Wash.",
        "Wis.",
        "Wisc.",
        "Wy.",
        "Wyo.",
        "Yuk."
    ],
    PREPOSITIVE_ABBREVIATIONS: [
        "Adm.",
        "Attys.",
        "Brig.",
        "Capt.",
        "Cmdr.",
        "Col.",
        "Cpl.",
        "Det.",
        "Dr.",
        "Gen.",
        "Gov.",
        "Ing.",
        "Lt.",
        "Maj.",
        "Mr.",
        "Mrs.",
        "Ms.",
        "Mt.",
        "Messrs.",
        "Mssrs.",
        "Prof.",
        "Ph.",
        "Rep.",
        "Reps.",
        "Rev.",
        "Sen.",
        "Sens.",
        "Sgt.",
        "St.",
        "Supt.",
		"U.S. National Institutes of Health",
		"V.",
        "Vs."
    ],
    EXCALAMATION_WORDS: [
        "!Xũ",
        "!Kung",
        "ǃʼOǃKung",
        "!Xuun",
        "!Kung-Ekoka",
        "ǃHu",
        "ǃKhung",
        "ǃKu",
        "ǃung",
        "ǃXo",
        "ǃXû",
        "ǃXung",
        "ǃXũ",
        "!Xun",
        "Yahoo!",
        "Y!J",
        "Yum!"
    ]
};

},{}],30:[function(require,module,exports){
// LICENSE : MIT
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ast_node_types_1 = require("@textlint/ast-node-types");
var SourceCode_1 = require("./parser/SourceCode");
var NewLineParser_1 = require("./parser/NewLineParser");
var SpaceParser_1 = require("./parser/SpaceParser");
var SeparatorParser_1 = require("./parser/SeparatorParser");
var AnyValueParser_1 = require("./parser/AnyValueParser");
var AbbrMarker_1 = require("./parser/AbbrMarker");
var PairMaker_1 = require("./parser/PairMaker");
var logger_1 = require("./logger");
exports.Syntax = {
    WhiteSpace: "WhiteSpace",
    Punctuation: "Punctuation",
    Sentence: "Sentence",
    Str: "Str"
};
var SplitParser = /** @class */ (function () {
    function SplitParser(text) {
        this.nodeList = [];
        this.results = [];
        this.source = new SourceCode_1.SourceCode(text);
    }
    Object.defineProperty(SplitParser.prototype, "current", {
        get: function () {
            return this.nodeList[this.nodeList.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    SplitParser.prototype.pushNodeToCurrent = function (node) {
        var current = this.current;
        if (current) {
            current.children.push(node);
        }
        else {
            // Under the root
            this.results.push(node);
        }
    };
    // open with ParentNode
    SplitParser.prototype.open = function (parentNode) {
        this.nodeList.push(parentNode);
    };
    SplitParser.prototype.isOpened = function () {
        return this.nodeList.length > 0;
    };
    SplitParser.prototype.nextLine = function (parser) {
        var _a = this.source.seekNext(parser), value = _a.value, startPosition = _a.startPosition, endPosition = _a.endPosition;
        this.pushNodeToCurrent(createWhiteSpaceNode(value, startPosition, endPosition));
        return endPosition;
    };
    SplitParser.prototype.nextSpace = function (parser) {
        var _a = this.source.seekNext(parser), value = _a.value, startPosition = _a.startPosition, endPosition = _a.endPosition;
        this.pushNodeToCurrent(createNode("WhiteSpace", value, startPosition, endPosition));
    };
    SplitParser.prototype.nextValue = function (parser) {
        var _a = this.source.seekNext(parser), value = _a.value, startPosition = _a.startPosition, endPosition = _a.endPosition;
        this.pushNodeToCurrent(createTextNode(value, startPosition, endPosition));
    };
    // close current Node and remove it from list
    SplitParser.prototype.close = function (parser) {
        var _a = this.source.seekNext(parser), value = _a.value, startPosition = _a.startPosition, endPosition = _a.endPosition;
        if (startPosition.offset !== endPosition.offset) {
            this.pushNodeToCurrent(createPunctuationNode(value, startPosition, endPosition));
        }
        var currentNode = this.nodeList.pop();
        if (!currentNode) {
            return;
        }
        if (currentNode.children.length === 0) {
            return;
        }
        var firstChildNode = currentNode.children[0];
        var endNow = this.source.now();
        currentNode.loc = {
            start: firstChildNode.loc.start,
            end: nowToLoc(endNow)
        };
        var rawValue = this.source.sliceRange(firstChildNode.range[0], endNow.offset);
        currentNode.range = [firstChildNode.range[0], endNow.offset];
        currentNode.raw = rawValue;
        this.results.push(currentNode);
    };
    SplitParser.prototype.toList = function () {
        return this.results;
    };
    return SplitParser;
}());
exports.SplitParser = SplitParser;
var createParsers = function (options) {
    if (options === void 0) { options = {}; }
    var newLine = new NewLineParser_1.NewLineParser();
    var space = new SpaceParser_1.SpaceParser();
    var separator = new SeparatorParser_1.SeparatorParser(options.SeparatorParser);
    var abbrMarker = new AbbrMarker_1.AbbrMarker();
    var pairMaker = new PairMaker_1.PairMaker();
    // anyValueParser has multiple parser and markers.
    // anyValueParse eat any value if it reach to other value.
    var anyValueParser = new AnyValueParser_1.AnyValueParser({
        parsers: [newLine, separator],
        markers: [abbrMarker, pairMaker]
    });
    return {
        newLine: newLine,
        space: space,
        separator: separator,
        abbrMarker: abbrMarker,
        anyValueParser: anyValueParser
    };
};
/**
 * split `text` into Sentence nodes
 */
function split(text, options) {
    var _a = createParsers(options), newLine = _a.newLine, space = _a.space, separator = _a.separator, anyValueParser = _a.anyValueParser;
    var splitParser = new SplitParser(text);
    var sourceCode = splitParser.source;
    while (!sourceCode.hasEnd) {
        if (newLine.test(sourceCode)) {
            splitParser.nextLine(newLine);
        }
        else if (space.test(sourceCode)) {
            // Add WhiteSpace
            splitParser.nextSpace(space);
        }
        else if (separator.test(sourceCode)) {
            splitParser.close(separator);
        }
        else {
            if (!splitParser.isOpened()) {
                splitParser.open(createEmptySentenceNode());
            }
            splitParser.nextValue(anyValueParser);
        }
    }
    splitParser.close(space);
    return splitParser.toList();
}
exports.split = split;
/**
 * Convert Paragraph Node to Paragraph node that convert children to Sentence node
 * This Node is based on TxtAST.
 * See https://github.com/textlint/textlint/blob/master/docs/txtnode.md
 */
function splitAST(paragraphNode, options) {
    var _a = createParsers(options), newLine = _a.newLine, space = _a.space, separator = _a.separator, anyValueParser = _a.anyValueParser;
    var splitParser = new SplitParser(paragraphNode);
    var sourceCode = splitParser.source;
    while (!sourceCode.hasEnd) {
        var currentNode = sourceCode.readNode();
        if (!currentNode) {
            break;
        }
        if (currentNode.type === ast_node_types_1.ASTNodeTypes.Str) {
            if (space.test(sourceCode)) {
                logger_1.debugLog("space");
                splitParser.nextSpace(space);
            }
            else if (separator.test(sourceCode)) {
                logger_1.debugLog("separator");
                splitParser.close(separator);
            }
            else if (newLine.test(sourceCode)) {
                logger_1.debugLog("newline");
                splitParser.nextLine(newLine);
            }
            else {
                if (!splitParser.isOpened()) {
                    logger_1.debugLog("open -> createEmptySentenceNode()");
                    splitParser.open(createEmptySentenceNode());
                }
                splitParser.nextValue(anyValueParser);
            }
        }
        else {
            if (!splitParser.isOpened()) {
                splitParser.open(createEmptySentenceNode());
            }
            splitParser.pushNodeToCurrent(currentNode);
            sourceCode.peekNode(currentNode);
        }
    }
    // It follow some text that is not ended with period.
    // TODO: space is correct?
    splitParser.close(space);
    return __assign(__assign({}, paragraphNode), { children: splitParser.toList() });
}
exports.splitAST = splitAST;
/**
 * WhiteSpace is space or linebreak
 */
function createWhiteSpaceNode(text, startPosition, endPosition) {
    return createNode("WhiteSpace", text, startPosition, endPosition);
}
exports.createWhiteSpaceNode = createWhiteSpaceNode;
function createPunctuationNode(text, startPosition, endPosition) {
    return createNode("Punctuation", text, startPosition, endPosition);
}
exports.createPunctuationNode = createPunctuationNode;
function createTextNode(text, startPosition, endPosition) {
    return createNode("Str", text, startPosition, endPosition);
}
exports.createTextNode = createTextNode;
function createEmptySentenceNode() {
    return {
        type: "Sentence",
        raw: "",
        loc: {
            start: { column: NaN, line: NaN },
            end: { column: NaN, line: NaN }
        },
        range: [NaN, NaN],
        children: []
    };
}
exports.createEmptySentenceNode = createEmptySentenceNode;
function createNode(type, text, startPosition, endPosition) {
    return {
        type: type,
        raw: text,
        value: text,
        loc: {
            start: nowToLoc(startPosition),
            end: nowToLoc(endPosition)
        },
        range: [startPosition.offset, endPosition.offset]
    };
}
exports.createNode = createNode;
function nowToLoc(now) {
    return {
        line: now.line,
        column: now.column
    };
}

},{"./logger":21,"./parser/AbbrMarker":22,"./parser/AnyValueParser":23,"./parser/NewLineParser":24,"./parser/PairMaker":25,"./parser/SeparatorParser":26,"./parser/SourceCode":27,"./parser/SpaceParser":28,"@textlint/ast-node-types":1}],31:[function(require,module,exports){
"use strict";

var StructuredSource = require('./structured-source.js')["default"];


module.exports = StructuredSource;

/* vim: set sw=4 ts=4 et tw=80 : */

},{"./structured-source.js":32}],32:[function(require,module,exports){
"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);
  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

var upperBound = require('boundary').upperBound;
var Position = function Position(line, column) {
  this.line = line;
  this.column = column;
};

exports.Position = Position;
var SourceLocation = function SourceLocation(start, end) {
  this.start = start;
  this.end = end;
};

exports.SourceLocation = SourceLocation;
var StructuredSource = (function () {
  var StructuredSource =
  /**
   * @constructs StructuredSource
   * @param {string} source - source code text.
   */
  function StructuredSource(source) {
    this.indice = [0];
    var regexp = /[\r\n\u2028\u2029]/g;
    var length = source.length;
    regexp.lastIndex = 0;
    while (true) {
      var result = regexp.exec(source);
      if (!result) {
        break;
      }
      var index = result.index;
      if (source.charCodeAt(index) === 13 /* '\r' */ && source.charCodeAt(index + 1) === 10 /* '\n' */) {
        index += 1;
      }
      var nextIndex = index + 1;
      // If there's a last line terminator, we push it to the indice.
      // So use < instead of <=.
      if (length < nextIndex) {
        break;
      }
      this.indice.push(nextIndex);
      regexp.lastIndex = nextIndex;
    }
  };

  StructuredSource.prototype.locationToRange = function (loc) {
    return [this.positionToIndex(loc.start), this.positionToIndex(loc.end)];
  };

  StructuredSource.prototype.rangeToLocation = function (range) {
    return new SourceLocation(this.indexToPosition(range[0]), this.indexToPosition(range[1]));
  };

  StructuredSource.prototype.positionToIndex = function (pos) {
    // Line number starts with 1.
    // Column number starts with 0.
    var start = this.indice[pos.line - 1];
    return start + pos.column;
  };

  StructuredSource.prototype.indexToPosition = function (index) {
    var startLine = upperBound(this.indice, index);
    return new Position(startLine, index - this.indice[startLine - 1]);
  };

  _classProps(StructuredSource, null, {
    line: {
      get: function () {
        return this.indice.length;
      }
    }
  });

  return StructuredSource;
})();

exports["default"] = StructuredSource;

},{"boundary":2}],33:[function(require,module,exports){
const sentsplit = require('sentence-splitter');

exports.new_outer_splitter = function new_outer_splitter(raw_text) {
		var new_text = ''
		var inside_stuff = []
    var inside_indices = []
		var inside_bracket_switch = 0

		// Here we will filter out stuff that adds noise to sentences, right now its quotes and (brackets + stuff inside them)
		for (i = 0 ; i < raw_text.length; i ++) {
				if (inside_bracket_switch == 0) {
						if (raw_text[i] == '[') {
								inside_bracket_switch = 1
								inside_stuff.push('')
								inside_indices.push(i)
						}
						else if (raw_text[i] == '\"') {
								inside_stuff.push('\"')
								inside_indices.push(i)
						}
						else {
								new_text = new_text + raw_text[i]
						}
				}
			if (inside_bracket_switch == 1) {
          inside_stuff[inside_stuff.length - 1] = inside_stuff[inside_stuff.length - 1] + raw_text[i]
          if (raw_text[i] == ']') {
              inside_bracket_switch = 0
          }
			}
		}


		// Call inner splitter


    split_sent = new_inner_splitter(new_text)



		// here we reconstruct the stuff we cut out of the sentences, inside each sentence

    curr_sent = 0
    curr_char = 0
    curr_sent_char = 0
    inside_indices_index = 0

    while (curr_char < raw_text.length) {
        if (curr_char == inside_indices[inside_indices_index]) {
            split_sent[curr_sent] = split_sent[curr_sent].slice(0, curr_sent_char) + inside_stuff[inside_indices_index] + split_sent[curr_sent].slice(curr_sent_char)
            inside_indices_index += 1
        }
        curr_char += 1
        curr_sent_char += 1
        if (curr_sent_char == split_sent[curr_sent].length) {
						if (curr_sent != split_sent.length -1 ) {
            		curr_sent += 1
            		curr_sent_char = 0
						}
        }
    }


		// here we do some qol pruning on the lists (right now, moving quotes into the correct side of the sentence)
		for (sent_index = 1; sent_index <split_sent.length; sent_index ++ )  {

				if (split_sent[sent_index][0] == "\"") {
						split_sent[sent_index - 1] += "\""
						split_sent[sent_index] = split_sent[sent_index].slice(1)
				}
		}


    return split_sent
    // console.log(raw_text)
    // console.log(final_text)
}

function new_inner_splitter(sentences) {
  const DELIMITER = '\u{1F440}';
  separatorCharacters = [
    ".",
    "．",
    "。",
    "?",
    "!",
    "？",
    "！", // (ja) zenkaku exclamation mark
    DELIMITER
  ];
  a =  sentsplit.split(sentences, {SeparatorParser: {separatorCharacters: separatorCharacters}})
  b = []
  for (i = 0 ; i < a.length; i++) {
      b.push(a[i]["raw"])
  }
  return b

}

},{"sentence-splitter":30}],34:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[33])(33)
});
