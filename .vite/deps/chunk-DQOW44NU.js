import {
  __esm,
  __export
} from "./chunk-PLDDJCW6.js";

// node_modules/underscore/modules/_setup.js
var VERSION, root, ArrayProto, ObjProto, SymbolProto, push, slice, toString, hasOwnProperty, supportsArrayBuffer, supportsDataView, nativeIsArray, nativeKeys, nativeCreate, nativeIsView, _isNaN, _isFinite, hasEnumBug, nonEnumerableProps, MAX_ARRAY_INDEX;
var init_setup = __esm({
  "node_modules/underscore/modules/_setup.js"() {
    VERSION = "1.13.7";
    root = typeof self == "object" && self.self === self && self || typeof global == "object" && global.global === global && global || Function("return this")() || {};
    ArrayProto = Array.prototype;
    ObjProto = Object.prototype;
    SymbolProto = typeof Symbol !== "undefined" ? Symbol.prototype : null;
    push = ArrayProto.push;
    slice = ArrayProto.slice;
    toString = ObjProto.toString;
    hasOwnProperty = ObjProto.hasOwnProperty;
    supportsArrayBuffer = typeof ArrayBuffer !== "undefined";
    supportsDataView = typeof DataView !== "undefined";
    nativeIsArray = Array.isArray;
    nativeKeys = Object.keys;
    nativeCreate = Object.create;
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;
    _isNaN = isNaN;
    _isFinite = isFinite;
    hasEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
    nonEnumerableProps = [
      "valueOf",
      "isPrototypeOf",
      "toString",
      "propertyIsEnumerable",
      "hasOwnProperty",
      "toLocaleString"
    ];
    MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  }
});

// node_modules/underscore/modules/restArguments.js
function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    var length = Math.max(arguments.length - startIndex, 0), rest2 = Array(length), index = 0;
    for (; index < length; index++) {
      rest2[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest2);
      case 1:
        return func.call(this, arguments[0], rest2);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest2);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest2;
    return func.apply(this, args);
  };
}
var init_restArguments = __esm({
  "node_modules/underscore/modules/restArguments.js"() {
  }
});

// node_modules/underscore/modules/isObject.js
function isObject(obj) {
  var type = typeof obj;
  return type === "function" || type === "object" && !!obj;
}
var init_isObject = __esm({
  "node_modules/underscore/modules/isObject.js"() {
  }
});

// node_modules/underscore/modules/isNull.js
function isNull(obj) {
  return obj === null;
}
var init_isNull = __esm({
  "node_modules/underscore/modules/isNull.js"() {
  }
});

// node_modules/underscore/modules/isUndefined.js
function isUndefined(obj) {
  return obj === void 0;
}
var init_isUndefined = __esm({
  "node_modules/underscore/modules/isUndefined.js"() {
  }
});

// node_modules/underscore/modules/isBoolean.js
function isBoolean(obj) {
  return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
}
var init_isBoolean = __esm({
  "node_modules/underscore/modules/isBoolean.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/isElement.js
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}
var init_isElement = __esm({
  "node_modules/underscore/modules/isElement.js"() {
  }
});

// node_modules/underscore/modules/_tagTester.js
function tagTester(name) {
  var tag = "[object " + name + "]";
  return function(obj) {
    return toString.call(obj) === tag;
  };
}
var init_tagTester = __esm({
  "node_modules/underscore/modules/_tagTester.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/isString.js
var isString_default;
var init_isString = __esm({
  "node_modules/underscore/modules/isString.js"() {
    init_tagTester();
    isString_default = tagTester("String");
  }
});

// node_modules/underscore/modules/isNumber.js
var isNumber_default;
var init_isNumber = __esm({
  "node_modules/underscore/modules/isNumber.js"() {
    init_tagTester();
    isNumber_default = tagTester("Number");
  }
});

// node_modules/underscore/modules/isDate.js
var isDate_default;
var init_isDate = __esm({
  "node_modules/underscore/modules/isDate.js"() {
    init_tagTester();
    isDate_default = tagTester("Date");
  }
});

// node_modules/underscore/modules/isRegExp.js
var isRegExp_default;
var init_isRegExp = __esm({
  "node_modules/underscore/modules/isRegExp.js"() {
    init_tagTester();
    isRegExp_default = tagTester("RegExp");
  }
});

// node_modules/underscore/modules/isError.js
var isError_default;
var init_isError = __esm({
  "node_modules/underscore/modules/isError.js"() {
    init_tagTester();
    isError_default = tagTester("Error");
  }
});

// node_modules/underscore/modules/isSymbol.js
var isSymbol_default;
var init_isSymbol = __esm({
  "node_modules/underscore/modules/isSymbol.js"() {
    init_tagTester();
    isSymbol_default = tagTester("Symbol");
  }
});

// node_modules/underscore/modules/isArrayBuffer.js
var isArrayBuffer_default;
var init_isArrayBuffer = __esm({
  "node_modules/underscore/modules/isArrayBuffer.js"() {
    init_tagTester();
    isArrayBuffer_default = tagTester("ArrayBuffer");
  }
});

// node_modules/underscore/modules/isFunction.js
var isFunction, nodelist, isFunction_default;
var init_isFunction = __esm({
  "node_modules/underscore/modules/isFunction.js"() {
    init_tagTester();
    init_setup();
    isFunction = tagTester("Function");
    nodelist = root.document && root.document.childNodes;
    if (typeof /./ != "function" && typeof Int8Array != "object" && typeof nodelist != "function") {
      isFunction = function(obj) {
        return typeof obj == "function" || false;
      };
    }
    isFunction_default = isFunction;
  }
});

// node_modules/underscore/modules/_hasObjectTag.js
var hasObjectTag_default;
var init_hasObjectTag = __esm({
  "node_modules/underscore/modules/_hasObjectTag.js"() {
    init_tagTester();
    hasObjectTag_default = tagTester("Object");
  }
});

// node_modules/underscore/modules/_stringTagBug.js
var hasDataViewBug, isIE11;
var init_stringTagBug = __esm({
  "node_modules/underscore/modules/_stringTagBug.js"() {
    init_setup();
    init_hasObjectTag();
    hasDataViewBug = supportsDataView && (!/\[native code\]/.test(String(DataView)) || hasObjectTag_default(new DataView(new ArrayBuffer(8))));
    isIE11 = typeof Map !== "undefined" && hasObjectTag_default(/* @__PURE__ */ new Map());
  }
});

// node_modules/underscore/modules/isDataView.js
function alternateIsDataView(obj) {
  return obj != null && isFunction_default(obj.getInt8) && isArrayBuffer_default(obj.buffer);
}
var isDataView, isDataView_default;
var init_isDataView = __esm({
  "node_modules/underscore/modules/isDataView.js"() {
    init_tagTester();
    init_isFunction();
    init_isArrayBuffer();
    init_stringTagBug();
    isDataView = tagTester("DataView");
    isDataView_default = hasDataViewBug ? alternateIsDataView : isDataView;
  }
});

// node_modules/underscore/modules/isArray.js
var isArray_default;
var init_isArray = __esm({
  "node_modules/underscore/modules/isArray.js"() {
    init_setup();
    init_tagTester();
    isArray_default = nativeIsArray || tagTester("Array");
  }
});

// node_modules/underscore/modules/_has.js
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
}
var init_has = __esm({
  "node_modules/underscore/modules/_has.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/isArguments.js
var isArguments, isArguments_default;
var init_isArguments = __esm({
  "node_modules/underscore/modules/isArguments.js"() {
    init_tagTester();
    init_has();
    isArguments = tagTester("Arguments");
    (function() {
      if (!isArguments(arguments)) {
        isArguments = function(obj) {
          return has(obj, "callee");
        };
      }
    })();
    isArguments_default = isArguments;
  }
});

// node_modules/underscore/modules/isFinite.js
function isFinite2(obj) {
  return !isSymbol_default(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}
var init_isFinite = __esm({
  "node_modules/underscore/modules/isFinite.js"() {
    init_setup();
    init_isSymbol();
  }
});

// node_modules/underscore/modules/isNaN.js
function isNaN2(obj) {
  return isNumber_default(obj) && _isNaN(obj);
}
var init_isNaN = __esm({
  "node_modules/underscore/modules/isNaN.js"() {
    init_setup();
    init_isNumber();
  }
});

// node_modules/underscore/modules/constant.js
function constant(value) {
  return function() {
    return value;
  };
}
var init_constant = __esm({
  "node_modules/underscore/modules/constant.js"() {
  }
});

// node_modules/underscore/modules/_createSizePropertyCheck.js
function createSizePropertyCheck(getSizeProperty) {
  return function(collection) {
    var sizeProperty = getSizeProperty(collection);
    return typeof sizeProperty == "number" && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
  };
}
var init_createSizePropertyCheck = __esm({
  "node_modules/underscore/modules/_createSizePropertyCheck.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/_shallowProperty.js
function shallowProperty(key) {
  return function(obj) {
    return obj == null ? void 0 : obj[key];
  };
}
var init_shallowProperty = __esm({
  "node_modules/underscore/modules/_shallowProperty.js"() {
  }
});

// node_modules/underscore/modules/_getByteLength.js
var getByteLength_default;
var init_getByteLength = __esm({
  "node_modules/underscore/modules/_getByteLength.js"() {
    init_shallowProperty();
    getByteLength_default = shallowProperty("byteLength");
  }
});

// node_modules/underscore/modules/_isBufferLike.js
var isBufferLike_default;
var init_isBufferLike = __esm({
  "node_modules/underscore/modules/_isBufferLike.js"() {
    init_createSizePropertyCheck();
    init_getByteLength();
    isBufferLike_default = createSizePropertyCheck(getByteLength_default);
  }
});

// node_modules/underscore/modules/isTypedArray.js
function isTypedArray(obj) {
  return nativeIsView ? nativeIsView(obj) && !isDataView_default(obj) : isBufferLike_default(obj) && typedArrayPattern.test(toString.call(obj));
}
var typedArrayPattern, isTypedArray_default;
var init_isTypedArray = __esm({
  "node_modules/underscore/modules/isTypedArray.js"() {
    init_setup();
    init_isDataView();
    init_constant();
    init_isBufferLike();
    typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
    isTypedArray_default = supportsArrayBuffer ? isTypedArray : constant(false);
  }
});

// node_modules/underscore/modules/_getLength.js
var getLength_default;
var init_getLength = __esm({
  "node_modules/underscore/modules/_getLength.js"() {
    init_shallowProperty();
    getLength_default = shallowProperty("length");
  }
});

// node_modules/underscore/modules/_collectNonEnumProps.js
function emulatedSet(keys2) {
  var hash = {};
  for (var l = keys2.length, i = 0; i < l; ++i) hash[keys2[i]] = true;
  return {
    contains: function(key) {
      return hash[key] === true;
    },
    push: function(key) {
      hash[key] = true;
      return keys2.push(key);
    }
  };
}
function collectNonEnumProps(obj, keys2) {
  keys2 = emulatedSet(keys2);
  var nonEnumIdx = nonEnumerableProps.length;
  var constructor = obj.constructor;
  var proto = isFunction_default(constructor) && constructor.prototype || ObjProto;
  var prop = "constructor";
  if (has(obj, prop) && !keys2.contains(prop)) keys2.push(prop);
  while (nonEnumIdx--) {
    prop = nonEnumerableProps[nonEnumIdx];
    if (prop in obj && obj[prop] !== proto[prop] && !keys2.contains(prop)) {
      keys2.push(prop);
    }
  }
}
var init_collectNonEnumProps = __esm({
  "node_modules/underscore/modules/_collectNonEnumProps.js"() {
    init_setup();
    init_isFunction();
    init_has();
  }
});

// node_modules/underscore/modules/keys.js
function keys(obj) {
  if (!isObject(obj)) return [];
  if (nativeKeys) return nativeKeys(obj);
  var keys2 = [];
  for (var key in obj) if (has(obj, key)) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}
var init_keys = __esm({
  "node_modules/underscore/modules/keys.js"() {
    init_isObject();
    init_setup();
    init_has();
    init_collectNonEnumProps();
  }
});

// node_modules/underscore/modules/isEmpty.js
function isEmpty(obj) {
  if (obj == null) return true;
  var length = getLength_default(obj);
  if (typeof length == "number" && (isArray_default(obj) || isString_default(obj) || isArguments_default(obj))) return length === 0;
  return getLength_default(keys(obj)) === 0;
}
var init_isEmpty = __esm({
  "node_modules/underscore/modules/isEmpty.js"() {
    init_getLength();
    init_isArray();
    init_isString();
    init_isArguments();
    init_keys();
  }
});

// node_modules/underscore/modules/isMatch.js
function isMatch(object2, attrs) {
  var _keys = keys(attrs), length = _keys.length;
  if (object2 == null) return !length;
  var obj = Object(object2);
  for (var i = 0; i < length; i++) {
    var key = _keys[i];
    if (attrs[key] !== obj[key] || !(key in obj)) return false;
  }
  return true;
}
var init_isMatch = __esm({
  "node_modules/underscore/modules/isMatch.js"() {
    init_keys();
  }
});

// node_modules/underscore/modules/underscore.js
function _(obj) {
  if (obj instanceof _) return obj;
  if (!(this instanceof _)) return new _(obj);
  this._wrapped = obj;
}
var init_underscore = __esm({
  "node_modules/underscore/modules/underscore.js"() {
    init_setup();
    _.VERSION = VERSION;
    _.prototype.value = function() {
      return this._wrapped;
    };
    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
    _.prototype.toString = function() {
      return String(this._wrapped);
    };
  }
});

// node_modules/underscore/modules/_toBufferView.js
function toBufferView(bufferSource) {
  return new Uint8Array(
    bufferSource.buffer || bufferSource,
    bufferSource.byteOffset || 0,
    getByteLength_default(bufferSource)
  );
}
var init_toBufferView = __esm({
  "node_modules/underscore/modules/_toBufferView.js"() {
    init_getByteLength();
  }
});

// node_modules/underscore/modules/isEqual.js
function eq(a, b, aStack, bStack) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  if (a == null || b == null) return false;
  if (a !== a) return b !== b;
  var type = typeof a;
  if (type !== "function" && type !== "object" && typeof b != "object") return false;
  return deepEq(a, b, aStack, bStack);
}
function deepEq(a, b, aStack, bStack) {
  if (a instanceof _) a = a._wrapped;
  if (b instanceof _) b = b._wrapped;
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;
  if (hasDataViewBug && className == "[object Object]" && isDataView_default(a)) {
    if (!isDataView_default(b)) return false;
    className = tagDataView;
  }
  switch (className) {
    // These types are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + a === "" + b;
    case "[object Number]":
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case "[object Date]":
    case "[object Boolean]":
      return +a === +b;
    case "[object Symbol]":
      return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    case "[object ArrayBuffer]":
    case tagDataView:
      return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
  }
  var areArrays = className === "[object Array]";
  if (!areArrays && isTypedArray_default(a)) {
    var byteLength = getByteLength_default(a);
    if (byteLength !== getByteLength_default(b)) return false;
    if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
    areArrays = true;
  }
  if (!areArrays) {
    if (typeof a != "object" || typeof b != "object") return false;
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(isFunction_default(aCtor) && aCtor instanceof aCtor && isFunction_default(bCtor) && bCtor instanceof bCtor) && ("constructor" in a && "constructor" in b)) {
      return false;
    }
  }
  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;
  while (length--) {
    if (aStack[length] === a) return bStack[length] === b;
  }
  aStack.push(a);
  bStack.push(b);
  if (areArrays) {
    length = a.length;
    if (length !== b.length) return false;
    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  } else {
    var _keys = keys(a), key;
    length = _keys.length;
    if (keys(b).length !== length) return false;
    while (length--) {
      key = _keys[length];
      if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }
  aStack.pop();
  bStack.pop();
  return true;
}
function isEqual(a, b) {
  return eq(a, b);
}
var tagDataView;
var init_isEqual = __esm({
  "node_modules/underscore/modules/isEqual.js"() {
    init_underscore();
    init_setup();
    init_getByteLength();
    init_isTypedArray();
    init_isFunction();
    init_stringTagBug();
    init_isDataView();
    init_keys();
    init_has();
    init_toBufferView();
    tagDataView = "[object DataView]";
  }
});

// node_modules/underscore/modules/allKeys.js
function allKeys(obj) {
  if (!isObject(obj)) return [];
  var keys2 = [];
  for (var key in obj) keys2.push(key);
  if (hasEnumBug) collectNonEnumProps(obj, keys2);
  return keys2;
}
var init_allKeys = __esm({
  "node_modules/underscore/modules/allKeys.js"() {
    init_isObject();
    init_setup();
    init_collectNonEnumProps();
  }
});

// node_modules/underscore/modules/_methodFingerprint.js
function ie11fingerprint(methods) {
  var length = getLength_default(methods);
  return function(obj) {
    if (obj == null) return false;
    var keys2 = allKeys(obj);
    if (getLength_default(keys2)) return false;
    for (var i = 0; i < length; i++) {
      if (!isFunction_default(obj[methods[i]])) return false;
    }
    return methods !== weakMapMethods || !isFunction_default(obj[forEachName]);
  };
}
var forEachName, hasName, commonInit, mapTail, mapMethods, weakMapMethods, setMethods;
var init_methodFingerprint = __esm({
  "node_modules/underscore/modules/_methodFingerprint.js"() {
    init_getLength();
    init_isFunction();
    init_allKeys();
    forEachName = "forEach";
    hasName = "has";
    commonInit = ["clear", "delete"];
    mapTail = ["get", hasName, "set"];
    mapMethods = commonInit.concat(forEachName, mapTail);
    weakMapMethods = commonInit.concat(mapTail);
    setMethods = ["add"].concat(commonInit, forEachName, hasName);
  }
});

// node_modules/underscore/modules/isMap.js
var isMap_default;
var init_isMap = __esm({
  "node_modules/underscore/modules/isMap.js"() {
    init_tagTester();
    init_stringTagBug();
    init_methodFingerprint();
    isMap_default = isIE11 ? ie11fingerprint(mapMethods) : tagTester("Map");
  }
});

// node_modules/underscore/modules/isWeakMap.js
var isWeakMap_default;
var init_isWeakMap = __esm({
  "node_modules/underscore/modules/isWeakMap.js"() {
    init_tagTester();
    init_stringTagBug();
    init_methodFingerprint();
    isWeakMap_default = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester("WeakMap");
  }
});

// node_modules/underscore/modules/isSet.js
var isSet_default;
var init_isSet = __esm({
  "node_modules/underscore/modules/isSet.js"() {
    init_tagTester();
    init_stringTagBug();
    init_methodFingerprint();
    isSet_default = isIE11 ? ie11fingerprint(setMethods) : tagTester("Set");
  }
});

// node_modules/underscore/modules/isWeakSet.js
var isWeakSet_default;
var init_isWeakSet = __esm({
  "node_modules/underscore/modules/isWeakSet.js"() {
    init_tagTester();
    isWeakSet_default = tagTester("WeakSet");
  }
});

// node_modules/underscore/modules/values.js
function values(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var values2 = Array(length);
  for (var i = 0; i < length; i++) {
    values2[i] = obj[_keys[i]];
  }
  return values2;
}
var init_values = __esm({
  "node_modules/underscore/modules/values.js"() {
    init_keys();
  }
});

// node_modules/underscore/modules/pairs.js
function pairs(obj) {
  var _keys = keys(obj);
  var length = _keys.length;
  var pairs2 = Array(length);
  for (var i = 0; i < length; i++) {
    pairs2[i] = [_keys[i], obj[_keys[i]]];
  }
  return pairs2;
}
var init_pairs = __esm({
  "node_modules/underscore/modules/pairs.js"() {
    init_keys();
  }
});

// node_modules/underscore/modules/invert.js
function invert(obj) {
  var result2 = {};
  var _keys = keys(obj);
  for (var i = 0, length = _keys.length; i < length; i++) {
    result2[obj[_keys[i]]] = _keys[i];
  }
  return result2;
}
var init_invert = __esm({
  "node_modules/underscore/modules/invert.js"() {
    init_keys();
  }
});

// node_modules/underscore/modules/functions.js
function functions(obj) {
  var names = [];
  for (var key in obj) {
    if (isFunction_default(obj[key])) names.push(key);
  }
  return names.sort();
}
var init_functions = __esm({
  "node_modules/underscore/modules/functions.js"() {
    init_isFunction();
  }
});

// node_modules/underscore/modules/_createAssigner.js
function createAssigner(keysFunc, defaults) {
  return function(obj) {
    var length = arguments.length;
    if (defaults) obj = Object(obj);
    if (length < 2 || obj == null) return obj;
    for (var index = 1; index < length; index++) {
      var source = arguments[index], keys2 = keysFunc(source), l = keys2.length;
      for (var i = 0; i < l; i++) {
        var key = keys2[i];
        if (!defaults || obj[key] === void 0) obj[key] = source[key];
      }
    }
    return obj;
  };
}
var init_createAssigner = __esm({
  "node_modules/underscore/modules/_createAssigner.js"() {
  }
});

// node_modules/underscore/modules/extend.js
var extend_default;
var init_extend = __esm({
  "node_modules/underscore/modules/extend.js"() {
    init_createAssigner();
    init_allKeys();
    extend_default = createAssigner(allKeys);
  }
});

// node_modules/underscore/modules/extendOwn.js
var extendOwn_default;
var init_extendOwn = __esm({
  "node_modules/underscore/modules/extendOwn.js"() {
    init_createAssigner();
    init_keys();
    extendOwn_default = createAssigner(keys);
  }
});

// node_modules/underscore/modules/defaults.js
var defaults_default;
var init_defaults = __esm({
  "node_modules/underscore/modules/defaults.js"() {
    init_createAssigner();
    init_allKeys();
    defaults_default = createAssigner(allKeys, true);
  }
});

// node_modules/underscore/modules/_baseCreate.js
function ctor() {
  return function() {
  };
}
function baseCreate(prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  var Ctor = ctor();
  Ctor.prototype = prototype;
  var result2 = new Ctor();
  Ctor.prototype = null;
  return result2;
}
var init_baseCreate = __esm({
  "node_modules/underscore/modules/_baseCreate.js"() {
    init_isObject();
    init_setup();
  }
});

// node_modules/underscore/modules/create.js
function create(prototype, props) {
  var result2 = baseCreate(prototype);
  if (props) extendOwn_default(result2, props);
  return result2;
}
var init_create = __esm({
  "node_modules/underscore/modules/create.js"() {
    init_baseCreate();
    init_extendOwn();
  }
});

// node_modules/underscore/modules/clone.js
function clone(obj) {
  if (!isObject(obj)) return obj;
  return isArray_default(obj) ? obj.slice() : extend_default({}, obj);
}
var init_clone = __esm({
  "node_modules/underscore/modules/clone.js"() {
    init_isObject();
    init_isArray();
    init_extend();
  }
});

// node_modules/underscore/modules/tap.js
function tap(obj, interceptor) {
  interceptor(obj);
  return obj;
}
var init_tap = __esm({
  "node_modules/underscore/modules/tap.js"() {
  }
});

// node_modules/underscore/modules/toPath.js
function toPath(path) {
  return isArray_default(path) ? path : [path];
}
var init_toPath = __esm({
  "node_modules/underscore/modules/toPath.js"() {
    init_underscore();
    init_isArray();
    _.toPath = toPath;
  }
});

// node_modules/underscore/modules/_toPath.js
function toPath2(path) {
  return _.toPath(path);
}
var init_toPath2 = __esm({
  "node_modules/underscore/modules/_toPath.js"() {
    init_underscore();
    init_toPath();
  }
});

// node_modules/underscore/modules/_deepGet.js
function deepGet(obj, path) {
  var length = path.length;
  for (var i = 0; i < length; i++) {
    if (obj == null) return void 0;
    obj = obj[path[i]];
  }
  return length ? obj : void 0;
}
var init_deepGet = __esm({
  "node_modules/underscore/modules/_deepGet.js"() {
  }
});

// node_modules/underscore/modules/get.js
function get(object2, path, defaultValue) {
  var value = deepGet(object2, toPath2(path));
  return isUndefined(value) ? defaultValue : value;
}
var init_get = __esm({
  "node_modules/underscore/modules/get.js"() {
    init_toPath2();
    init_deepGet();
    init_isUndefined();
  }
});

// node_modules/underscore/modules/has.js
function has2(obj, path) {
  path = toPath2(path);
  var length = path.length;
  for (var i = 0; i < length; i++) {
    var key = path[i];
    if (!has(obj, key)) return false;
    obj = obj[key];
  }
  return !!length;
}
var init_has2 = __esm({
  "node_modules/underscore/modules/has.js"() {
    init_has();
    init_toPath2();
  }
});

// node_modules/underscore/modules/identity.js
function identity(value) {
  return value;
}
var init_identity = __esm({
  "node_modules/underscore/modules/identity.js"() {
  }
});

// node_modules/underscore/modules/matcher.js
function matcher(attrs) {
  attrs = extendOwn_default({}, attrs);
  return function(obj) {
    return isMatch(obj, attrs);
  };
}
var init_matcher = __esm({
  "node_modules/underscore/modules/matcher.js"() {
    init_extendOwn();
    init_isMatch();
  }
});

// node_modules/underscore/modules/property.js
function property(path) {
  path = toPath2(path);
  return function(obj) {
    return deepGet(obj, path);
  };
}
var init_property = __esm({
  "node_modules/underscore/modules/property.js"() {
    init_deepGet();
    init_toPath2();
  }
});

// node_modules/underscore/modules/_optimizeCb.js
function optimizeCb(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1:
      return function(value) {
        return func.call(context, value);
      };
    // The 2-argument case is omitted because we’re not using it.
    case 3:
      return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
    case 4:
      return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
  }
  return function() {
    return func.apply(context, arguments);
  };
}
var init_optimizeCb = __esm({
  "node_modules/underscore/modules/_optimizeCb.js"() {
  }
});

// node_modules/underscore/modules/_baseIteratee.js
function baseIteratee(value, context, argCount) {
  if (value == null) return identity;
  if (isFunction_default(value)) return optimizeCb(value, context, argCount);
  if (isObject(value) && !isArray_default(value)) return matcher(value);
  return property(value);
}
var init_baseIteratee = __esm({
  "node_modules/underscore/modules/_baseIteratee.js"() {
    init_identity();
    init_isFunction();
    init_isObject();
    init_isArray();
    init_matcher();
    init_property();
    init_optimizeCb();
  }
});

// node_modules/underscore/modules/iteratee.js
function iteratee(value, context) {
  return baseIteratee(value, context, Infinity);
}
var init_iteratee = __esm({
  "node_modules/underscore/modules/iteratee.js"() {
    init_underscore();
    init_baseIteratee();
    _.iteratee = iteratee;
  }
});

// node_modules/underscore/modules/_cb.js
function cb(value, context, argCount) {
  if (_.iteratee !== iteratee) return _.iteratee(value, context);
  return baseIteratee(value, context, argCount);
}
var init_cb = __esm({
  "node_modules/underscore/modules/_cb.js"() {
    init_underscore();
    init_baseIteratee();
    init_iteratee();
  }
});

// node_modules/underscore/modules/mapObject.js
function mapObject(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = keys(obj), length = _keys.length, results = {};
  for (var index = 0; index < length; index++) {
    var currentKey = _keys[index];
    results[currentKey] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}
var init_mapObject = __esm({
  "node_modules/underscore/modules/mapObject.js"() {
    init_cb();
    init_keys();
  }
});

// node_modules/underscore/modules/noop.js
function noop() {
}
var init_noop = __esm({
  "node_modules/underscore/modules/noop.js"() {
  }
});

// node_modules/underscore/modules/propertyOf.js
function propertyOf(obj) {
  if (obj == null) return noop;
  return function(path) {
    return get(obj, path);
  };
}
var init_propertyOf = __esm({
  "node_modules/underscore/modules/propertyOf.js"() {
    init_noop();
    init_get();
  }
});

// node_modules/underscore/modules/times.js
function times(n, iteratee2, context) {
  var accum = Array(Math.max(0, n));
  iteratee2 = optimizeCb(iteratee2, context, 1);
  for (var i = 0; i < n; i++) accum[i] = iteratee2(i);
  return accum;
}
var init_times = __esm({
  "node_modules/underscore/modules/times.js"() {
    init_optimizeCb();
  }
});

// node_modules/underscore/modules/random.js
function random(min2, max2) {
  if (max2 == null) {
    max2 = min2;
    min2 = 0;
  }
  return min2 + Math.floor(Math.random() * (max2 - min2 + 1));
}
var init_random = __esm({
  "node_modules/underscore/modules/random.js"() {
  }
});

// node_modules/underscore/modules/now.js
var now_default;
var init_now = __esm({
  "node_modules/underscore/modules/now.js"() {
    now_default = Date.now || function() {
      return (/* @__PURE__ */ new Date()).getTime();
    };
  }
});

// node_modules/underscore/modules/_createEscaper.js
function createEscaper(map2) {
  var escaper = function(match) {
    return map2[match];
  };
  var source = "(?:" + keys(map2).join("|") + ")";
  var testRegexp = RegExp(source);
  var replaceRegexp = RegExp(source, "g");
  return function(string) {
    string = string == null ? "" : "" + string;
    return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
  };
}
var init_createEscaper = __esm({
  "node_modules/underscore/modules/_createEscaper.js"() {
    init_keys();
  }
});

// node_modules/underscore/modules/_escapeMap.js
var escapeMap_default;
var init_escapeMap = __esm({
  "node_modules/underscore/modules/_escapeMap.js"() {
    escapeMap_default = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "`": "&#x60;"
    };
  }
});

// node_modules/underscore/modules/escape.js
var escape_default;
var init_escape = __esm({
  "node_modules/underscore/modules/escape.js"() {
    init_createEscaper();
    init_escapeMap();
    escape_default = createEscaper(escapeMap_default);
  }
});

// node_modules/underscore/modules/_unescapeMap.js
var unescapeMap_default;
var init_unescapeMap = __esm({
  "node_modules/underscore/modules/_unescapeMap.js"() {
    init_invert();
    init_escapeMap();
    unescapeMap_default = invert(escapeMap_default);
  }
});

// node_modules/underscore/modules/unescape.js
var unescape_default;
var init_unescape = __esm({
  "node_modules/underscore/modules/unescape.js"() {
    init_createEscaper();
    init_unescapeMap();
    unescape_default = createEscaper(unescapeMap_default);
  }
});

// node_modules/underscore/modules/templateSettings.js
var templateSettings_default;
var init_templateSettings = __esm({
  "node_modules/underscore/modules/templateSettings.js"() {
    init_underscore();
    templateSettings_default = _.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    };
  }
});

// node_modules/underscore/modules/template.js
function escapeChar(match) {
  return "\\" + escapes[match];
}
function template(text, settings, oldSettings) {
  if (!settings && oldSettings) settings = oldSettings;
  settings = defaults_default({}, settings, _.templateSettings);
  var matcher2 = RegExp([
    (settings.escape || noMatch).source,
    (settings.interpolate || noMatch).source,
    (settings.evaluate || noMatch).source
  ].join("|") + "|$", "g");
  var index = 0;
  var source = "__p+='";
  text.replace(matcher2, function(match, escape, interpolate, evaluate, offset) {
    source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
    index = offset + match.length;
    if (escape) {
      source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
    } else if (interpolate) {
      source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
    } else if (evaluate) {
      source += "';\n" + evaluate + "\n__p+='";
    }
    return match;
  });
  source += "';\n";
  var argument = settings.variable;
  if (argument) {
    if (!bareIdentifier.test(argument)) throw new Error(
      "variable is not a bare identifier: " + argument
    );
  } else {
    source = "with(obj||{}){\n" + source + "}\n";
    argument = "obj";
  }
  source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
  var render;
  try {
    render = new Function(argument, "_", source);
  } catch (e) {
    e.source = source;
    throw e;
  }
  var template2 = function(data) {
    return render.call(this, data, _);
  };
  template2.source = "function(" + argument + "){\n" + source + "}";
  return template2;
}
var noMatch, escapes, escapeRegExp, bareIdentifier;
var init_template = __esm({
  "node_modules/underscore/modules/template.js"() {
    init_defaults();
    init_underscore();
    init_templateSettings();
    noMatch = /(.)^/;
    escapes = {
      "'": "'",
      "\\": "\\",
      "\r": "r",
      "\n": "n",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
    bareIdentifier = /^\s*(\w|\$)+\s*$/;
  }
});

// node_modules/underscore/modules/result.js
function result(obj, path, fallback) {
  path = toPath2(path);
  var length = path.length;
  if (!length) {
    return isFunction_default(fallback) ? fallback.call(obj) : fallback;
  }
  for (var i = 0; i < length; i++) {
    var prop = obj == null ? void 0 : obj[path[i]];
    if (prop === void 0) {
      prop = fallback;
      i = length;
    }
    obj = isFunction_default(prop) ? prop.call(obj) : prop;
  }
  return obj;
}
var init_result = __esm({
  "node_modules/underscore/modules/result.js"() {
    init_isFunction();
    init_toPath2();
  }
});

// node_modules/underscore/modules/uniqueId.js
function uniqueId(prefix) {
  var id = ++idCounter + "";
  return prefix ? prefix + id : id;
}
var idCounter;
var init_uniqueId = __esm({
  "node_modules/underscore/modules/uniqueId.js"() {
    idCounter = 0;
  }
});

// node_modules/underscore/modules/chain.js
function chain(obj) {
  var instance = _(obj);
  instance._chain = true;
  return instance;
}
var init_chain = __esm({
  "node_modules/underscore/modules/chain.js"() {
    init_underscore();
  }
});

// node_modules/underscore/modules/_executeBound.js
function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
  if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
  var self2 = baseCreate(sourceFunc.prototype);
  var result2 = sourceFunc.apply(self2, args);
  if (isObject(result2)) return result2;
  return self2;
}
var init_executeBound = __esm({
  "node_modules/underscore/modules/_executeBound.js"() {
    init_baseCreate();
    init_isObject();
  }
});

// node_modules/underscore/modules/partial.js
var partial, partial_default;
var init_partial = __esm({
  "node_modules/underscore/modules/partial.js"() {
    init_restArguments();
    init_executeBound();
    init_underscore();
    partial = restArguments(function(func, boundArgs) {
      var placeholder = partial.placeholder;
      var bound = function() {
        var position = 0, length = boundArgs.length;
        var args = Array(length);
        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
        }
        while (position < arguments.length) args.push(arguments[position++]);
        return executeBound(func, bound, this, this, args);
      };
      return bound;
    });
    partial.placeholder = _;
    partial_default = partial;
  }
});

// node_modules/underscore/modules/bind.js
var bind_default;
var init_bind = __esm({
  "node_modules/underscore/modules/bind.js"() {
    init_restArguments();
    init_isFunction();
    init_executeBound();
    bind_default = restArguments(function(func, context, args) {
      if (!isFunction_default(func)) throw new TypeError("Bind must be called on a function");
      var bound = restArguments(function(callArgs) {
        return executeBound(func, bound, context, this, args.concat(callArgs));
      });
      return bound;
    });
  }
});

// node_modules/underscore/modules/_isArrayLike.js
var isArrayLike_default;
var init_isArrayLike = __esm({
  "node_modules/underscore/modules/_isArrayLike.js"() {
    init_createSizePropertyCheck();
    init_getLength();
    isArrayLike_default = createSizePropertyCheck(getLength_default);
  }
});

// node_modules/underscore/modules/_flatten.js
function flatten(input, depth, strict, output) {
  output = output || [];
  if (!depth && depth !== 0) {
    depth = Infinity;
  } else if (depth <= 0) {
    return output.concat(input);
  }
  var idx = output.length;
  for (var i = 0, length = getLength_default(input); i < length; i++) {
    var value = input[i];
    if (isArrayLike_default(value) && (isArray_default(value) || isArguments_default(value))) {
      if (depth > 1) {
        flatten(value, depth - 1, strict, output);
        idx = output.length;
      } else {
        var j = 0, len = value.length;
        while (j < len) output[idx++] = value[j++];
      }
    } else if (!strict) {
      output[idx++] = value;
    }
  }
  return output;
}
var init_flatten = __esm({
  "node_modules/underscore/modules/_flatten.js"() {
    init_getLength();
    init_isArrayLike();
    init_isArray();
    init_isArguments();
  }
});

// node_modules/underscore/modules/bindAll.js
var bindAll_default;
var init_bindAll = __esm({
  "node_modules/underscore/modules/bindAll.js"() {
    init_restArguments();
    init_flatten();
    init_bind();
    bindAll_default = restArguments(function(obj, keys2) {
      keys2 = flatten(keys2, false, false);
      var index = keys2.length;
      if (index < 1) throw new Error("bindAll must be passed function names");
      while (index--) {
        var key = keys2[index];
        obj[key] = bind_default(obj[key], obj);
      }
      return obj;
    });
  }
});

// node_modules/underscore/modules/memoize.js
function memoize(func, hasher) {
  var memoize2 = function(key) {
    var cache = memoize2.cache;
    var address = "" + (hasher ? hasher.apply(this, arguments) : key);
    if (!has(cache, address)) cache[address] = func.apply(this, arguments);
    return cache[address];
  };
  memoize2.cache = {};
  return memoize2;
}
var init_memoize = __esm({
  "node_modules/underscore/modules/memoize.js"() {
    init_has();
  }
});

// node_modules/underscore/modules/delay.js
var delay_default;
var init_delay = __esm({
  "node_modules/underscore/modules/delay.js"() {
    init_restArguments();
    delay_default = restArguments(function(func, wait, args) {
      return setTimeout(function() {
        return func.apply(null, args);
      }, wait);
    });
  }
});

// node_modules/underscore/modules/defer.js
var defer_default;
var init_defer = __esm({
  "node_modules/underscore/modules/defer.js"() {
    init_partial();
    init_delay();
    init_underscore();
    defer_default = partial_default(delay_default, _, 1);
  }
});

// node_modules/underscore/modules/throttle.js
function throttle(func, wait, options) {
  var timeout, context, args, result2;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : now_default();
    timeout = null;
    result2 = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  var throttled = function() {
    var _now = now_default();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result2 = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result2;
  };
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };
  return throttled;
}
var init_throttle = __esm({
  "node_modules/underscore/modules/throttle.js"() {
    init_now();
  }
});

// node_modules/underscore/modules/debounce.js
function debounce(func, wait, immediate) {
  var timeout, previous, args, result2, context;
  var later = function() {
    var passed = now_default() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result2 = func.apply(context, args);
      if (!timeout) args = context = null;
    }
  };
  var debounced = restArguments(function(_args) {
    context = this;
    args = _args;
    previous = now_default();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result2 = func.apply(context, args);
    }
    return result2;
  });
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = args = context = null;
  };
  return debounced;
}
var init_debounce = __esm({
  "node_modules/underscore/modules/debounce.js"() {
    init_restArguments();
    init_now();
  }
});

// node_modules/underscore/modules/wrap.js
function wrap(func, wrapper) {
  return partial_default(wrapper, func);
}
var init_wrap = __esm({
  "node_modules/underscore/modules/wrap.js"() {
    init_partial();
  }
});

// node_modules/underscore/modules/negate.js
function negate(predicate) {
  return function() {
    return !predicate.apply(this, arguments);
  };
}
var init_negate = __esm({
  "node_modules/underscore/modules/negate.js"() {
  }
});

// node_modules/underscore/modules/compose.js
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result2 = args[start].apply(this, arguments);
    while (i--) result2 = args[i].call(this, result2);
    return result2;
  };
}
var init_compose = __esm({
  "node_modules/underscore/modules/compose.js"() {
  }
});

// node_modules/underscore/modules/after.js
function after(times2, func) {
  return function() {
    if (--times2 < 1) {
      return func.apply(this, arguments);
    }
  };
}
var init_after = __esm({
  "node_modules/underscore/modules/after.js"() {
  }
});

// node_modules/underscore/modules/before.js
function before(times2, func) {
  var memo;
  return function() {
    if (--times2 > 0) {
      memo = func.apply(this, arguments);
    }
    if (times2 <= 1) func = null;
    return memo;
  };
}
var init_before = __esm({
  "node_modules/underscore/modules/before.js"() {
  }
});

// node_modules/underscore/modules/once.js
var once_default;
var init_once = __esm({
  "node_modules/underscore/modules/once.js"() {
    init_partial();
    init_before();
    once_default = partial_default(before, 2);
  }
});

// node_modules/underscore/modules/findKey.js
function findKey(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = keys(obj), key;
  for (var i = 0, length = _keys.length; i < length; i++) {
    key = _keys[i];
    if (predicate(obj[key], key, obj)) return key;
  }
}
var init_findKey = __esm({
  "node_modules/underscore/modules/findKey.js"() {
    init_cb();
    init_keys();
  }
});

// node_modules/underscore/modules/_createPredicateIndexFinder.js
function createPredicateIndexFinder(dir) {
  return function(array, predicate, context) {
    predicate = cb(predicate, context);
    var length = getLength_default(array);
    var index = dir > 0 ? 0 : length - 1;
    for (; index >= 0 && index < length; index += dir) {
      if (predicate(array[index], index, array)) return index;
    }
    return -1;
  };
}
var init_createPredicateIndexFinder = __esm({
  "node_modules/underscore/modules/_createPredicateIndexFinder.js"() {
    init_cb();
    init_getLength();
  }
});

// node_modules/underscore/modules/findIndex.js
var findIndex_default;
var init_findIndex = __esm({
  "node_modules/underscore/modules/findIndex.js"() {
    init_createPredicateIndexFinder();
    findIndex_default = createPredicateIndexFinder(1);
  }
});

// node_modules/underscore/modules/findLastIndex.js
var findLastIndex_default;
var init_findLastIndex = __esm({
  "node_modules/underscore/modules/findLastIndex.js"() {
    init_createPredicateIndexFinder();
    findLastIndex_default = createPredicateIndexFinder(-1);
  }
});

// node_modules/underscore/modules/sortedIndex.js
function sortedIndex(array, obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context, 1);
  var value = iteratee2(obj);
  var low = 0, high = getLength_default(array);
  while (low < high) {
    var mid = Math.floor((low + high) / 2);
    if (iteratee2(array[mid]) < value) low = mid + 1;
    else high = mid;
  }
  return low;
}
var init_sortedIndex = __esm({
  "node_modules/underscore/modules/sortedIndex.js"() {
    init_cb();
    init_getLength();
  }
});

// node_modules/underscore/modules/_createIndexFinder.js
function createIndexFinder(dir, predicateFind, sortedIndex2) {
  return function(array, item, idx) {
    var i = 0, length = getLength_default(array);
    if (typeof idx == "number") {
      if (dir > 0) {
        i = idx >= 0 ? idx : Math.max(idx + length, i);
      } else {
        length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
      }
    } else if (sortedIndex2 && idx && length) {
      idx = sortedIndex2(array, item);
      return array[idx] === item ? idx : -1;
    }
    if (item !== item) {
      idx = predicateFind(slice.call(array, i, length), isNaN2);
      return idx >= 0 ? idx + i : -1;
    }
    for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
      if (array[idx] === item) return idx;
    }
    return -1;
  };
}
var init_createIndexFinder = __esm({
  "node_modules/underscore/modules/_createIndexFinder.js"() {
    init_getLength();
    init_setup();
    init_isNaN();
  }
});

// node_modules/underscore/modules/indexOf.js
var indexOf_default;
var init_indexOf = __esm({
  "node_modules/underscore/modules/indexOf.js"() {
    init_sortedIndex();
    init_findIndex();
    init_createIndexFinder();
    indexOf_default = createIndexFinder(1, findIndex_default, sortedIndex);
  }
});

// node_modules/underscore/modules/lastIndexOf.js
var lastIndexOf_default;
var init_lastIndexOf = __esm({
  "node_modules/underscore/modules/lastIndexOf.js"() {
    init_findLastIndex();
    init_createIndexFinder();
    lastIndexOf_default = createIndexFinder(-1, findLastIndex_default);
  }
});

// node_modules/underscore/modules/find.js
function find(obj, predicate, context) {
  var keyFinder = isArrayLike_default(obj) ? findIndex_default : findKey;
  var key = keyFinder(obj, predicate, context);
  if (key !== void 0 && key !== -1) return obj[key];
}
var init_find = __esm({
  "node_modules/underscore/modules/find.js"() {
    init_isArrayLike();
    init_findIndex();
    init_findKey();
  }
});

// node_modules/underscore/modules/findWhere.js
function findWhere(obj, attrs) {
  return find(obj, matcher(attrs));
}
var init_findWhere = __esm({
  "node_modules/underscore/modules/findWhere.js"() {
    init_find();
    init_matcher();
  }
});

// node_modules/underscore/modules/each.js
function each(obj, iteratee2, context) {
  iteratee2 = optimizeCb(iteratee2, context);
  var i, length;
  if (isArrayLike_default(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee2(obj[i], i, obj);
    }
  } else {
    var _keys = keys(obj);
    for (i = 0, length = _keys.length; i < length; i++) {
      iteratee2(obj[_keys[i]], _keys[i], obj);
    }
  }
  return obj;
}
var init_each = __esm({
  "node_modules/underscore/modules/each.js"() {
    init_optimizeCb();
    init_isArrayLike();
    init_keys();
  }
});

// node_modules/underscore/modules/map.js
function map(obj, iteratee2, context) {
  iteratee2 = cb(iteratee2, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, results = Array(length);
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    results[index] = iteratee2(obj[currentKey], currentKey, obj);
  }
  return results;
}
var init_map = __esm({
  "node_modules/underscore/modules/map.js"() {
    init_cb();
    init_isArrayLike();
    init_keys();
  }
});

// node_modules/underscore/modules/_createReduce.js
function createReduce(dir) {
  var reducer = function(obj, iteratee2, memo, initial2) {
    var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
    if (!initial2) {
      memo = obj[_keys ? _keys[index] : index];
      index += dir;
    }
    for (; index >= 0 && index < length; index += dir) {
      var currentKey = _keys ? _keys[index] : index;
      memo = iteratee2(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };
  return function(obj, iteratee2, memo, context) {
    var initial2 = arguments.length >= 3;
    return reducer(obj, optimizeCb(iteratee2, context, 4), memo, initial2);
  };
}
var init_createReduce = __esm({
  "node_modules/underscore/modules/_createReduce.js"() {
    init_isArrayLike();
    init_keys();
    init_optimizeCb();
  }
});

// node_modules/underscore/modules/reduce.js
var reduce_default;
var init_reduce = __esm({
  "node_modules/underscore/modules/reduce.js"() {
    init_createReduce();
    reduce_default = createReduce(1);
  }
});

// node_modules/underscore/modules/reduceRight.js
var reduceRight_default;
var init_reduceRight = __esm({
  "node_modules/underscore/modules/reduceRight.js"() {
    init_createReduce();
    reduceRight_default = createReduce(-1);
  }
});

// node_modules/underscore/modules/filter.js
function filter(obj, predicate, context) {
  var results = [];
  predicate = cb(predicate, context);
  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) results.push(value);
  });
  return results;
}
var init_filter = __esm({
  "node_modules/underscore/modules/filter.js"() {
    init_cb();
    init_each();
  }
});

// node_modules/underscore/modules/reject.js
function reject(obj, predicate, context) {
  return filter(obj, negate(cb(predicate)), context);
}
var init_reject = __esm({
  "node_modules/underscore/modules/reject.js"() {
    init_filter();
    init_negate();
    init_cb();
  }
});

// node_modules/underscore/modules/every.js
function every(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (!predicate(obj[currentKey], currentKey, obj)) return false;
  }
  return true;
}
var init_every = __esm({
  "node_modules/underscore/modules/every.js"() {
    init_cb();
    init_isArrayLike();
    init_keys();
  }
});

// node_modules/underscore/modules/some.js
function some(obj, predicate, context) {
  predicate = cb(predicate, context);
  var _keys = !isArrayLike_default(obj) && keys(obj), length = (_keys || obj).length;
  for (var index = 0; index < length; index++) {
    var currentKey = _keys ? _keys[index] : index;
    if (predicate(obj[currentKey], currentKey, obj)) return true;
  }
  return false;
}
var init_some = __esm({
  "node_modules/underscore/modules/some.js"() {
    init_cb();
    init_isArrayLike();
    init_keys();
  }
});

// node_modules/underscore/modules/contains.js
function contains(obj, item, fromIndex, guard) {
  if (!isArrayLike_default(obj)) obj = values(obj);
  if (typeof fromIndex != "number" || guard) fromIndex = 0;
  return indexOf_default(obj, item, fromIndex) >= 0;
}
var init_contains = __esm({
  "node_modules/underscore/modules/contains.js"() {
    init_isArrayLike();
    init_values();
    init_indexOf();
  }
});

// node_modules/underscore/modules/invoke.js
var invoke_default;
var init_invoke = __esm({
  "node_modules/underscore/modules/invoke.js"() {
    init_restArguments();
    init_isFunction();
    init_map();
    init_deepGet();
    init_toPath2();
    invoke_default = restArguments(function(obj, path, args) {
      var contextPath, func;
      if (isFunction_default(path)) {
        func = path;
      } else {
        path = toPath2(path);
        contextPath = path.slice(0, -1);
        path = path[path.length - 1];
      }
      return map(obj, function(context) {
        var method = func;
        if (!method) {
          if (contextPath && contextPath.length) {
            context = deepGet(context, contextPath);
          }
          if (context == null) return void 0;
          method = context[path];
        }
        return method == null ? method : method.apply(context, args);
      });
    });
  }
});

// node_modules/underscore/modules/pluck.js
function pluck(obj, key) {
  return map(obj, property(key));
}
var init_pluck = __esm({
  "node_modules/underscore/modules/pluck.js"() {
    init_map();
    init_property();
  }
});

// node_modules/underscore/modules/where.js
function where(obj, attrs) {
  return filter(obj, matcher(attrs));
}
var init_where = __esm({
  "node_modules/underscore/modules/where.js"() {
    init_filter();
    init_matcher();
  }
});

// node_modules/underscore/modules/max.js
function max(obj, iteratee2, context) {
  var result2 = -Infinity, lastComputed = -Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike_default(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value > result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function(v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed > lastComputed || computed === -Infinity && result2 === -Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}
var init_max = __esm({
  "node_modules/underscore/modules/max.js"() {
    init_isArrayLike();
    init_values();
    init_cb();
    init_each();
  }
});

// node_modules/underscore/modules/min.js
function min(obj, iteratee2, context) {
  var result2 = Infinity, lastComputed = Infinity, value, computed;
  if (iteratee2 == null || typeof iteratee2 == "number" && typeof obj[0] != "object" && obj != null) {
    obj = isArrayLike_default(obj) ? obj : values(obj);
    for (var i = 0, length = obj.length; i < length; i++) {
      value = obj[i];
      if (value != null && value < result2) {
        result2 = value;
      }
    }
  } else {
    iteratee2 = cb(iteratee2, context);
    each(obj, function(v, index, list) {
      computed = iteratee2(v, index, list);
      if (computed < lastComputed || computed === Infinity && result2 === Infinity) {
        result2 = v;
        lastComputed = computed;
      }
    });
  }
  return result2;
}
var init_min = __esm({
  "node_modules/underscore/modules/min.js"() {
    init_isArrayLike();
    init_values();
    init_cb();
    init_each();
  }
});

// node_modules/underscore/modules/toArray.js
function toArray(obj) {
  if (!obj) return [];
  if (isArray_default(obj)) return slice.call(obj);
  if (isString_default(obj)) {
    return obj.match(reStrSymbol);
  }
  if (isArrayLike_default(obj)) return map(obj, identity);
  return values(obj);
}
var reStrSymbol;
var init_toArray = __esm({
  "node_modules/underscore/modules/toArray.js"() {
    init_isArray();
    init_setup();
    init_isString();
    init_isArrayLike();
    init_map();
    init_identity();
    init_values();
    reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  }
});

// node_modules/underscore/modules/sample.js
function sample(obj, n, guard) {
  if (n == null || guard) {
    if (!isArrayLike_default(obj)) obj = values(obj);
    return obj[random(obj.length - 1)];
  }
  var sample2 = toArray(obj);
  var length = getLength_default(sample2);
  n = Math.max(Math.min(n, length), 0);
  var last2 = length - 1;
  for (var index = 0; index < n; index++) {
    var rand = random(index, last2);
    var temp = sample2[index];
    sample2[index] = sample2[rand];
    sample2[rand] = temp;
  }
  return sample2.slice(0, n);
}
var init_sample = __esm({
  "node_modules/underscore/modules/sample.js"() {
    init_isArrayLike();
    init_values();
    init_getLength();
    init_random();
    init_toArray();
  }
});

// node_modules/underscore/modules/shuffle.js
function shuffle(obj) {
  return sample(obj, Infinity);
}
var init_shuffle = __esm({
  "node_modules/underscore/modules/shuffle.js"() {
    init_sample();
  }
});

// node_modules/underscore/modules/sortBy.js
function sortBy(obj, iteratee2, context) {
  var index = 0;
  iteratee2 = cb(iteratee2, context);
  return pluck(map(obj, function(value, key, list) {
    return {
      value,
      index: index++,
      criteria: iteratee2(value, key, list)
    };
  }).sort(function(left, right) {
    var a = left.criteria;
    var b = right.criteria;
    if (a !== b) {
      if (a > b || a === void 0) return 1;
      if (a < b || b === void 0) return -1;
    }
    return left.index - right.index;
  }), "value");
}
var init_sortBy = __esm({
  "node_modules/underscore/modules/sortBy.js"() {
    init_cb();
    init_pluck();
    init_map();
  }
});

// node_modules/underscore/modules/_group.js
function group(behavior, partition) {
  return function(obj, iteratee2, context) {
    var result2 = partition ? [[], []] : {};
    iteratee2 = cb(iteratee2, context);
    each(obj, function(value, index) {
      var key = iteratee2(value, index, obj);
      behavior(result2, value, key);
    });
    return result2;
  };
}
var init_group = __esm({
  "node_modules/underscore/modules/_group.js"() {
    init_cb();
    init_each();
  }
});

// node_modules/underscore/modules/groupBy.js
var groupBy_default;
var init_groupBy = __esm({
  "node_modules/underscore/modules/groupBy.js"() {
    init_group();
    init_has();
    groupBy_default = group(function(result2, value, key) {
      if (has(result2, key)) result2[key].push(value);
      else result2[key] = [value];
    });
  }
});

// node_modules/underscore/modules/indexBy.js
var indexBy_default;
var init_indexBy = __esm({
  "node_modules/underscore/modules/indexBy.js"() {
    init_group();
    indexBy_default = group(function(result2, value, key) {
      result2[key] = value;
    });
  }
});

// node_modules/underscore/modules/countBy.js
var countBy_default;
var init_countBy = __esm({
  "node_modules/underscore/modules/countBy.js"() {
    init_group();
    init_has();
    countBy_default = group(function(result2, value, key) {
      if (has(result2, key)) result2[key]++;
      else result2[key] = 1;
    });
  }
});

// node_modules/underscore/modules/partition.js
var partition_default;
var init_partition = __esm({
  "node_modules/underscore/modules/partition.js"() {
    init_group();
    partition_default = group(function(result2, value, pass) {
      result2[pass ? 0 : 1].push(value);
    }, true);
  }
});

// node_modules/underscore/modules/size.js
function size(obj) {
  if (obj == null) return 0;
  return isArrayLike_default(obj) ? obj.length : keys(obj).length;
}
var init_size = __esm({
  "node_modules/underscore/modules/size.js"() {
    init_isArrayLike();
    init_keys();
  }
});

// node_modules/underscore/modules/_keyInObj.js
function keyInObj(value, key, obj) {
  return key in obj;
}
var init_keyInObj = __esm({
  "node_modules/underscore/modules/_keyInObj.js"() {
  }
});

// node_modules/underscore/modules/pick.js
var pick_default;
var init_pick = __esm({
  "node_modules/underscore/modules/pick.js"() {
    init_restArguments();
    init_isFunction();
    init_optimizeCb();
    init_allKeys();
    init_keyInObj();
    init_flatten();
    pick_default = restArguments(function(obj, keys2) {
      var result2 = {}, iteratee2 = keys2[0];
      if (obj == null) return result2;
      if (isFunction_default(iteratee2)) {
        if (keys2.length > 1) iteratee2 = optimizeCb(iteratee2, keys2[1]);
        keys2 = allKeys(obj);
      } else {
        iteratee2 = keyInObj;
        keys2 = flatten(keys2, false, false);
        obj = Object(obj);
      }
      for (var i = 0, length = keys2.length; i < length; i++) {
        var key = keys2[i];
        var value = obj[key];
        if (iteratee2(value, key, obj)) result2[key] = value;
      }
      return result2;
    });
  }
});

// node_modules/underscore/modules/omit.js
var omit_default;
var init_omit = __esm({
  "node_modules/underscore/modules/omit.js"() {
    init_restArguments();
    init_isFunction();
    init_negate();
    init_map();
    init_flatten();
    init_contains();
    init_pick();
    omit_default = restArguments(function(obj, keys2) {
      var iteratee2 = keys2[0], context;
      if (isFunction_default(iteratee2)) {
        iteratee2 = negate(iteratee2);
        if (keys2.length > 1) context = keys2[1];
      } else {
        keys2 = map(flatten(keys2, false, false), String);
        iteratee2 = function(value, key) {
          return !contains(keys2, key);
        };
      }
      return pick_default(obj, iteratee2, context);
    });
  }
});

// node_modules/underscore/modules/initial.js
function initial(array, n, guard) {
  return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}
var init_initial = __esm({
  "node_modules/underscore/modules/initial.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/first.js
function first(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[0];
  return initial(array, array.length - n);
}
var init_first = __esm({
  "node_modules/underscore/modules/first.js"() {
    init_initial();
  }
});

// node_modules/underscore/modules/rest.js
function rest(array, n, guard) {
  return slice.call(array, n == null || guard ? 1 : n);
}
var init_rest = __esm({
  "node_modules/underscore/modules/rest.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/last.js
function last(array, n, guard) {
  if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
  if (n == null || guard) return array[array.length - 1];
  return rest(array, Math.max(0, array.length - n));
}
var init_last = __esm({
  "node_modules/underscore/modules/last.js"() {
    init_rest();
  }
});

// node_modules/underscore/modules/compact.js
function compact(array) {
  return filter(array, Boolean);
}
var init_compact = __esm({
  "node_modules/underscore/modules/compact.js"() {
    init_filter();
  }
});

// node_modules/underscore/modules/flatten.js
function flatten2(array, depth) {
  return flatten(array, depth, false);
}
var init_flatten2 = __esm({
  "node_modules/underscore/modules/flatten.js"() {
    init_flatten();
  }
});

// node_modules/underscore/modules/difference.js
var difference_default;
var init_difference = __esm({
  "node_modules/underscore/modules/difference.js"() {
    init_restArguments();
    init_flatten();
    init_filter();
    init_contains();
    difference_default = restArguments(function(array, rest2) {
      rest2 = flatten(rest2, true, true);
      return filter(array, function(value) {
        return !contains(rest2, value);
      });
    });
  }
});

// node_modules/underscore/modules/without.js
var without_default;
var init_without = __esm({
  "node_modules/underscore/modules/without.js"() {
    init_restArguments();
    init_difference();
    without_default = restArguments(function(array, otherArrays) {
      return difference_default(array, otherArrays);
    });
  }
});

// node_modules/underscore/modules/uniq.js
function uniq(array, isSorted, iteratee2, context) {
  if (!isBoolean(isSorted)) {
    context = iteratee2;
    iteratee2 = isSorted;
    isSorted = false;
  }
  if (iteratee2 != null) iteratee2 = cb(iteratee2, context);
  var result2 = [];
  var seen = [];
  for (var i = 0, length = getLength_default(array); i < length; i++) {
    var value = array[i], computed = iteratee2 ? iteratee2(value, i, array) : value;
    if (isSorted && !iteratee2) {
      if (!i || seen !== computed) result2.push(value);
      seen = computed;
    } else if (iteratee2) {
      if (!contains(seen, computed)) {
        seen.push(computed);
        result2.push(value);
      }
    } else if (!contains(result2, value)) {
      result2.push(value);
    }
  }
  return result2;
}
var init_uniq = __esm({
  "node_modules/underscore/modules/uniq.js"() {
    init_isBoolean();
    init_cb();
    init_getLength();
    init_contains();
  }
});

// node_modules/underscore/modules/union.js
var union_default;
var init_union = __esm({
  "node_modules/underscore/modules/union.js"() {
    init_restArguments();
    init_uniq();
    init_flatten();
    union_default = restArguments(function(arrays) {
      return uniq(flatten(arrays, true, true));
    });
  }
});

// node_modules/underscore/modules/intersection.js
function intersection(array) {
  var result2 = [];
  var argsLength = arguments.length;
  for (var i = 0, length = getLength_default(array); i < length; i++) {
    var item = array[i];
    if (contains(result2, item)) continue;
    var j;
    for (j = 1; j < argsLength; j++) {
      if (!contains(arguments[j], item)) break;
    }
    if (j === argsLength) result2.push(item);
  }
  return result2;
}
var init_intersection = __esm({
  "node_modules/underscore/modules/intersection.js"() {
    init_getLength();
    init_contains();
  }
});

// node_modules/underscore/modules/unzip.js
function unzip(array) {
  var length = array && max(array, getLength_default).length || 0;
  var result2 = Array(length);
  for (var index = 0; index < length; index++) {
    result2[index] = pluck(array, index);
  }
  return result2;
}
var init_unzip = __esm({
  "node_modules/underscore/modules/unzip.js"() {
    init_max();
    init_getLength();
    init_pluck();
  }
});

// node_modules/underscore/modules/zip.js
var zip_default;
var init_zip = __esm({
  "node_modules/underscore/modules/zip.js"() {
    init_restArguments();
    init_unzip();
    zip_default = restArguments(unzip);
  }
});

// node_modules/underscore/modules/object.js
function object(list, values2) {
  var result2 = {};
  for (var i = 0, length = getLength_default(list); i < length; i++) {
    if (values2) {
      result2[list[i]] = values2[i];
    } else {
      result2[list[i][0]] = list[i][1];
    }
  }
  return result2;
}
var init_object = __esm({
  "node_modules/underscore/modules/object.js"() {
    init_getLength();
  }
});

// node_modules/underscore/modules/range.js
function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0;
    start = 0;
  }
  if (!step) {
    step = stop < start ? -1 : 1;
  }
  var length = Math.max(Math.ceil((stop - start) / step), 0);
  var range2 = Array(length);
  for (var idx = 0; idx < length; idx++, start += step) {
    range2[idx] = start;
  }
  return range2;
}
var init_range = __esm({
  "node_modules/underscore/modules/range.js"() {
  }
});

// node_modules/underscore/modules/chunk.js
function chunk(array, count) {
  if (count == null || count < 1) return [];
  var result2 = [];
  var i = 0, length = array.length;
  while (i < length) {
    result2.push(slice.call(array, i, i += count));
  }
  return result2;
}
var init_chunk = __esm({
  "node_modules/underscore/modules/chunk.js"() {
    init_setup();
  }
});

// node_modules/underscore/modules/_chainResult.js
function chainResult(instance, obj) {
  return instance._chain ? _(obj).chain() : obj;
}
var init_chainResult = __esm({
  "node_modules/underscore/modules/_chainResult.js"() {
    init_underscore();
  }
});

// node_modules/underscore/modules/mixin.js
function mixin(obj) {
  each(functions(obj), function(name) {
    var func = _[name] = obj[name];
    _.prototype[name] = function() {
      var args = [this._wrapped];
      push.apply(args, arguments);
      return chainResult(this, func.apply(_, args));
    };
  });
  return _;
}
var init_mixin = __esm({
  "node_modules/underscore/modules/mixin.js"() {
    init_underscore();
    init_each();
    init_functions();
    init_setup();
    init_chainResult();
  }
});

// node_modules/underscore/modules/underscore-array-methods.js
var underscore_array_methods_default;
var init_underscore_array_methods = __esm({
  "node_modules/underscore/modules/underscore-array-methods.js"() {
    init_underscore();
    init_each();
    init_setup();
    init_chainResult();
    each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        if (obj != null) {
          method.apply(obj, arguments);
          if ((name === "shift" || name === "splice") && obj.length === 0) {
            delete obj[0];
          }
        }
        return chainResult(this, obj);
      };
    });
    each(["concat", "join", "slice"], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        if (obj != null) obj = method.apply(obj, arguments);
        return chainResult(this, obj);
      };
    });
    underscore_array_methods_default = _;
  }
});

// node_modules/underscore/modules/index.js
var modules_exports = {};
__export(modules_exports, {
  VERSION: () => VERSION,
  after: () => after,
  all: () => every,
  allKeys: () => allKeys,
  any: () => some,
  assign: () => extendOwn_default,
  before: () => before,
  bind: () => bind_default,
  bindAll: () => bindAll_default,
  chain: () => chain,
  chunk: () => chunk,
  clone: () => clone,
  collect: () => map,
  compact: () => compact,
  compose: () => compose,
  constant: () => constant,
  contains: () => contains,
  countBy: () => countBy_default,
  create: () => create,
  debounce: () => debounce,
  default: () => underscore_array_methods_default,
  defaults: () => defaults_default,
  defer: () => defer_default,
  delay: () => delay_default,
  detect: () => find,
  difference: () => difference_default,
  drop: () => rest,
  each: () => each,
  escape: () => escape_default,
  every: () => every,
  extend: () => extend_default,
  extendOwn: () => extendOwn_default,
  filter: () => filter,
  find: () => find,
  findIndex: () => findIndex_default,
  findKey: () => findKey,
  findLastIndex: () => findLastIndex_default,
  findWhere: () => findWhere,
  first: () => first,
  flatten: () => flatten2,
  foldl: () => reduce_default,
  foldr: () => reduceRight_default,
  forEach: () => each,
  functions: () => functions,
  get: () => get,
  groupBy: () => groupBy_default,
  has: () => has2,
  head: () => first,
  identity: () => identity,
  include: () => contains,
  includes: () => contains,
  indexBy: () => indexBy_default,
  indexOf: () => indexOf_default,
  initial: () => initial,
  inject: () => reduce_default,
  intersection: () => intersection,
  invert: () => invert,
  invoke: () => invoke_default,
  isArguments: () => isArguments_default,
  isArray: () => isArray_default,
  isArrayBuffer: () => isArrayBuffer_default,
  isBoolean: () => isBoolean,
  isDataView: () => isDataView_default,
  isDate: () => isDate_default,
  isElement: () => isElement,
  isEmpty: () => isEmpty,
  isEqual: () => isEqual,
  isError: () => isError_default,
  isFinite: () => isFinite2,
  isFunction: () => isFunction_default,
  isMap: () => isMap_default,
  isMatch: () => isMatch,
  isNaN: () => isNaN2,
  isNull: () => isNull,
  isNumber: () => isNumber_default,
  isObject: () => isObject,
  isRegExp: () => isRegExp_default,
  isSet: () => isSet_default,
  isString: () => isString_default,
  isSymbol: () => isSymbol_default,
  isTypedArray: () => isTypedArray_default,
  isUndefined: () => isUndefined,
  isWeakMap: () => isWeakMap_default,
  isWeakSet: () => isWeakSet_default,
  iteratee: () => iteratee,
  keys: () => keys,
  last: () => last,
  lastIndexOf: () => lastIndexOf_default,
  map: () => map,
  mapObject: () => mapObject,
  matcher: () => matcher,
  matches: () => matcher,
  max: () => max,
  memoize: () => memoize,
  methods: () => functions,
  min: () => min,
  mixin: () => mixin,
  negate: () => negate,
  noop: () => noop,
  now: () => now_default,
  object: () => object,
  omit: () => omit_default,
  once: () => once_default,
  pairs: () => pairs,
  partial: () => partial_default,
  partition: () => partition_default,
  pick: () => pick_default,
  pluck: () => pluck,
  property: () => property,
  propertyOf: () => propertyOf,
  random: () => random,
  range: () => range,
  reduce: () => reduce_default,
  reduceRight: () => reduceRight_default,
  reject: () => reject,
  rest: () => rest,
  restArguments: () => restArguments,
  result: () => result,
  sample: () => sample,
  select: () => filter,
  shuffle: () => shuffle,
  size: () => size,
  some: () => some,
  sortBy: () => sortBy,
  sortedIndex: () => sortedIndex,
  tail: () => rest,
  take: () => first,
  tap: () => tap,
  template: () => template,
  templateSettings: () => templateSettings_default,
  throttle: () => throttle,
  times: () => times,
  toArray: () => toArray,
  toPath: () => toPath,
  transpose: () => unzip,
  unescape: () => unescape_default,
  union: () => union_default,
  uniq: () => uniq,
  unique: () => uniq,
  uniqueId: () => uniqueId,
  unzip: () => unzip,
  values: () => values,
  where: () => where,
  without: () => without_default,
  wrap: () => wrap,
  zip: () => zip_default
});
var init_modules = __esm({
  "node_modules/underscore/modules/index.js"() {
    init_setup();
    init_restArguments();
    init_isObject();
    init_isNull();
    init_isUndefined();
    init_isBoolean();
    init_isElement();
    init_isString();
    init_isNumber();
    init_isDate();
    init_isRegExp();
    init_isError();
    init_isSymbol();
    init_isArrayBuffer();
    init_isDataView();
    init_isArray();
    init_isFunction();
    init_isArguments();
    init_isFinite();
    init_isNaN();
    init_isTypedArray();
    init_isEmpty();
    init_isMatch();
    init_isEqual();
    init_isMap();
    init_isWeakMap();
    init_isSet();
    init_isWeakSet();
    init_keys();
    init_allKeys();
    init_values();
    init_pairs();
    init_invert();
    init_functions();
    init_extend();
    init_extendOwn();
    init_defaults();
    init_create();
    init_clone();
    init_tap();
    init_get();
    init_has2();
    init_mapObject();
    init_identity();
    init_constant();
    init_noop();
    init_toPath();
    init_property();
    init_propertyOf();
    init_matcher();
    init_times();
    init_random();
    init_now();
    init_escape();
    init_unescape();
    init_templateSettings();
    init_template();
    init_result();
    init_uniqueId();
    init_chain();
    init_iteratee();
    init_partial();
    init_bind();
    init_bindAll();
    init_memoize();
    init_delay();
    init_defer();
    init_throttle();
    init_debounce();
    init_wrap();
    init_negate();
    init_compose();
    init_after();
    init_before();
    init_once();
    init_findKey();
    init_findIndex();
    init_findLastIndex();
    init_sortedIndex();
    init_indexOf();
    init_lastIndexOf();
    init_find();
    init_findWhere();
    init_each();
    init_map();
    init_reduce();
    init_reduceRight();
    init_filter();
    init_reject();
    init_every();
    init_some();
    init_contains();
    init_invoke();
    init_pluck();
    init_where();
    init_max();
    init_min();
    init_shuffle();
    init_sample();
    init_sortBy();
    init_groupBy();
    init_indexBy();
    init_countBy();
    init_partition();
    init_toArray();
    init_size();
    init_pick();
    init_omit();
    init_first();
    init_initial();
    init_last();
    init_rest();
    init_compact();
    init_flatten2();
    init_without();
    init_uniq();
    init_union();
    init_intersection();
    init_difference();
    init_unzip();
    init_zip();
    init_object();
    init_range();
    init_chunk();
    init_mixin();
    init_underscore_array_methods();
  }
});

// node_modules/underscore/modules/index-default.js
var _2, index_default_default;
var init_index_default = __esm({
  "node_modules/underscore/modules/index-default.js"() {
    init_modules();
    init_modules();
    _2 = mixin(modules_exports);
    _2._ = _2;
    index_default_default = _2;
  }
});

// node_modules/underscore/modules/index-all.js
var index_all_exports = {};
__export(index_all_exports, {
  VERSION: () => VERSION,
  after: () => after,
  all: () => every,
  allKeys: () => allKeys,
  any: () => some,
  assign: () => extendOwn_default,
  before: () => before,
  bind: () => bind_default,
  bindAll: () => bindAll_default,
  chain: () => chain,
  chunk: () => chunk,
  clone: () => clone,
  collect: () => map,
  compact: () => compact,
  compose: () => compose,
  constant: () => constant,
  contains: () => contains,
  countBy: () => countBy_default,
  create: () => create,
  debounce: () => debounce,
  default: () => index_default_default,
  defaults: () => defaults_default,
  defer: () => defer_default,
  delay: () => delay_default,
  detect: () => find,
  difference: () => difference_default,
  drop: () => rest,
  each: () => each,
  escape: () => escape_default,
  every: () => every,
  extend: () => extend_default,
  extendOwn: () => extendOwn_default,
  filter: () => filter,
  find: () => find,
  findIndex: () => findIndex_default,
  findKey: () => findKey,
  findLastIndex: () => findLastIndex_default,
  findWhere: () => findWhere,
  first: () => first,
  flatten: () => flatten2,
  foldl: () => reduce_default,
  foldr: () => reduceRight_default,
  forEach: () => each,
  functions: () => functions,
  get: () => get,
  groupBy: () => groupBy_default,
  has: () => has2,
  head: () => first,
  identity: () => identity,
  include: () => contains,
  includes: () => contains,
  indexBy: () => indexBy_default,
  indexOf: () => indexOf_default,
  initial: () => initial,
  inject: () => reduce_default,
  intersection: () => intersection,
  invert: () => invert,
  invoke: () => invoke_default,
  isArguments: () => isArguments_default,
  isArray: () => isArray_default,
  isArrayBuffer: () => isArrayBuffer_default,
  isBoolean: () => isBoolean,
  isDataView: () => isDataView_default,
  isDate: () => isDate_default,
  isElement: () => isElement,
  isEmpty: () => isEmpty,
  isEqual: () => isEqual,
  isError: () => isError_default,
  isFinite: () => isFinite2,
  isFunction: () => isFunction_default,
  isMap: () => isMap_default,
  isMatch: () => isMatch,
  isNaN: () => isNaN2,
  isNull: () => isNull,
  isNumber: () => isNumber_default,
  isObject: () => isObject,
  isRegExp: () => isRegExp_default,
  isSet: () => isSet_default,
  isString: () => isString_default,
  isSymbol: () => isSymbol_default,
  isTypedArray: () => isTypedArray_default,
  isUndefined: () => isUndefined,
  isWeakMap: () => isWeakMap_default,
  isWeakSet: () => isWeakSet_default,
  iteratee: () => iteratee,
  keys: () => keys,
  last: () => last,
  lastIndexOf: () => lastIndexOf_default,
  map: () => map,
  mapObject: () => mapObject,
  matcher: () => matcher,
  matches: () => matcher,
  max: () => max,
  memoize: () => memoize,
  methods: () => functions,
  min: () => min,
  mixin: () => mixin,
  negate: () => negate,
  noop: () => noop,
  now: () => now_default,
  object: () => object,
  omit: () => omit_default,
  once: () => once_default,
  pairs: () => pairs,
  partial: () => partial_default,
  partition: () => partition_default,
  pick: () => pick_default,
  pluck: () => pluck,
  property: () => property,
  propertyOf: () => propertyOf,
  random: () => random,
  range: () => range,
  reduce: () => reduce_default,
  reduceRight: () => reduceRight_default,
  reject: () => reject,
  rest: () => rest,
  restArguments: () => restArguments,
  result: () => result,
  sample: () => sample,
  select: () => filter,
  shuffle: () => shuffle,
  size: () => size,
  some: () => some,
  sortBy: () => sortBy,
  sortedIndex: () => sortedIndex,
  tail: () => rest,
  take: () => first,
  tap: () => tap,
  template: () => template,
  templateSettings: () => templateSettings_default,
  throttle: () => throttle,
  times: () => times,
  toArray: () => toArray,
  toPath: () => toPath,
  transpose: () => unzip,
  unescape: () => unescape_default,
  union: () => union_default,
  uniq: () => uniq,
  unique: () => uniq,
  uniqueId: () => uniqueId,
  unzip: () => unzip,
  values: () => values,
  where: () => where,
  without: () => without_default,
  wrap: () => wrap,
  zip: () => zip_default
});
var init_index_all = __esm({
  "node_modules/underscore/modules/index-all.js"() {
    init_index_default();
    init_modules();
  }
});

export {
  VERSION,
  restArguments,
  isObject,
  isNull,
  isUndefined,
  isBoolean,
  isElement,
  isString_default,
  isNumber_default,
  isDate_default,
  isRegExp_default,
  isError_default,
  isSymbol_default,
  isArrayBuffer_default,
  isFunction_default,
  isDataView_default,
  isArray_default,
  isArguments_default,
  isFinite2 as isFinite,
  isNaN2 as isNaN,
  constant,
  isTypedArray_default,
  keys,
  isEmpty,
  isMatch,
  isEqual,
  allKeys,
  isMap_default,
  isWeakMap_default,
  isSet_default,
  isWeakSet_default,
  values,
  pairs,
  invert,
  functions,
  extend_default,
  extendOwn_default,
  defaults_default,
  create,
  clone,
  tap,
  toPath,
  get,
  has2 as has,
  identity,
  matcher,
  property,
  iteratee,
  mapObject,
  noop,
  propertyOf,
  times,
  random,
  now_default,
  escape_default,
  unescape_default,
  templateSettings_default,
  template,
  result,
  uniqueId,
  chain,
  partial_default,
  bind_default,
  bindAll_default,
  memoize,
  delay_default,
  defer_default,
  throttle,
  debounce,
  wrap,
  negate,
  compose,
  after,
  before,
  once_default,
  findKey,
  findIndex_default,
  findLastIndex_default,
  sortedIndex,
  indexOf_default,
  lastIndexOf_default,
  find,
  findWhere,
  each,
  map,
  reduce_default,
  reduceRight_default,
  filter,
  reject,
  every,
  some,
  contains,
  invoke_default,
  pluck,
  where,
  max,
  min,
  toArray,
  sample,
  shuffle,
  sortBy,
  groupBy_default,
  indexBy_default,
  countBy_default,
  partition_default,
  size,
  pick_default,
  omit_default,
  initial,
  first,
  rest,
  last,
  compact,
  flatten2 as flatten,
  difference_default,
  without_default,
  uniq,
  union_default,
  intersection,
  unzip,
  zip_default,
  object,
  range,
  chunk,
  mixin,
  index_default_default,
  index_all_exports,
  init_index_all
};
//# sourceMappingURL=chunk-DQOW44NU.js.map
