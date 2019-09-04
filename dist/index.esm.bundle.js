function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq_1(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return _assocIndexOf(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = _assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = _listCacheClear;
ListCache.prototype['delete'] = _listCacheDelete;
ListCache.prototype.get = _listCacheGet;
ListCache.prototype.has = _listCacheHas;
ListCache.prototype.set = _listCacheSet;

var _ListCache = ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new _ListCache;
  this.size = 0;
}

var _stackClear = stackClear;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas;

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag$1 && symToStringTag$1 in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/** Used to detect overreaching core-js shims. */
var coreJsData = _root['__core-js_shared__'];

var _coreJsData = coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked;

/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject_1(value) || _isMasked(value)) {
    return false;
  }
  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
  return pattern.test(_toSource(value));
}

var _baseIsNative = baseIsNative;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = _getValue(object, key);
  return _baseIsNative(value) ? value : undefined;
}

var _getNative = getNative;

/* Built-in method references that are verified to be native. */
var Map = _getNative(_root, 'Map');

var _Map = Map;

/* Built-in method references that are verified to be native. */
var nativeCreate = _getNative(Object, 'create');

var _nativeCreate = nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (_nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = _hashClear;
Hash.prototype['delete'] = _hashDelete;
Hash.prototype.get = _hashGet;
Hash.prototype.has = _hashHas;
Hash.prototype.set = _hashSet;

var _Hash = Hash;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new _Hash,
    'map': new (_Map || _ListCache),
    'string': new _Hash
  };
}

var _mapCacheClear = mapCacheClear;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return _isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = _getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return _getMapData(this, key).get(key);
}

var _mapCacheGet = mapCacheGet;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return _getMapData(this, key).has(key);
}

var _mapCacheHas = mapCacheHas;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = _getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = _mapCacheClear;
MapCache.prototype['delete'] = _mapCacheDelete;
MapCache.prototype.get = _mapCacheGet;
MapCache.prototype.has = _mapCacheHas;
MapCache.prototype.set = _mapCacheSet;

var _MapCache = MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof _ListCache) {
    var pairs = data.__data__;
    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new _MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new _ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = _stackClear;
Stack.prototype['delete'] = _stackDelete;
Stack.prototype.get = _stackGet;
Stack.prototype.has = _stackHas;
Stack.prototype.set = _stackSet;

var _Stack = Stack;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty$1 = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty$1) {
    _defineProperty$1(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq_1(object[key], value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = _createBaseFor();

var _baseFor = baseFor;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

/** Built-in value references. */
var Uint8Array = _root.Uint8Array;

var _Uint8Array = Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject_1(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg;

/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !_isPrototype(object))
    ? _baseCreate(_getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
}

var _baseIsArguments = baseIsArguments;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
  return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

var isArray_1 = isArray;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength_1(value.length) && !isFunction_1(value);
}

var isArrayLike_1 = isArrayLike;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike_1(value) && isArrayLike_1(value);
}

var isArrayLikeObject_1 = isArrayLikeObject;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? _root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse_1;

module.exports = isBuffer;
});

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype,
    objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag$1 = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike_1(value) &&
    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
}

var _baseIsTypedArray = baseIsTypedArray;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary;

var _nodeUtil = createCommonjsModule(function (module, exports) {
/** Detect free variable `exports`. */
var freeExports = exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && _freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

/* Node.js helper references. */
var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

var isTypedArray_1 = isTypedArray;

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

var _safeGet = safeGet;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq_1(objValue, value)) ||
      (value === undefined && !(key in object))) {
    _baseAssignValue(object, key, value);
  }
}

var _assignValue = assignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      _baseAssignValue(object, key, newValue);
    } else {
      _assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           _isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn;

/** Used for built-in method references. */
var objectProto$a = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$a.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject_1(object)) {
    return _nativeKeysIn(object);
  }
  var isProto = _isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
}

var keysIn_1 = keysIn;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return _copyObject(value, keysIn_1(value));
}

var toPlainObject_1 = toPlainObject;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = _safeGet(object, key),
      srcValue = _safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    _assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray_1(srcValue),
        isBuff = !isArr && isBuffer_1(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_1(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject_1(objValue)) {
        newValue = _copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = _cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = _cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
      newValue = objValue;
      if (isArguments_1(objValue)) {
        newValue = toPlainObject_1(objValue);
      }
      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
        newValue = _initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  _assignMergeValue(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  _baseFor(source, function(srcValue, key) {
    stack || (stack = new _Stack);
    if (isObject_1(srcValue)) {
      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      _assignMergeValue(object, key, newValue);
    }
  }, keysIn_1);
}

var _baseMerge = baseMerge;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

var identity_1 = identity;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return _apply(func, this, otherArgs);
  };
}

var _overRest = overRest;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !_defineProperty$1 ? identity_1 : function(func, string) {
  return _defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant_1(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = _shortOut(_baseSetToString);

var _setToString = setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return _setToString(_overRest(func, start, identity_1), func + '');
}

var _baseRest = baseRest;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject_1(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike_1(object) && _isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq_1(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return _baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner;

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = _createAssigner(function(object, source, srcIndex) {
  _baseMerge(object, source, srcIndex);
});

var merge_1 = merge;

var DEFAULTS = function DEFAULTS() {
  return {
    type: 'unscalable',
    noEvents: false,
    viewport: {
      offset: 0,
      barWidth: 10
    },
    // 图表显示的视野, width表示单个数据元素占用宽度
    valuePrecision: 4,
    // 设定的数据精度,
    valueFormatter: null,
    dateFormat: 'MM/DD HH:mm',
    // format pattern or function( date | UnixTime ) => string
    font: {
      family: 'Microsoft YaHei',
      size: 14
    },
    padding: {
      top: 20,
      right: 70,
      bottom: 28,
      left: 20
    },
    // 设定4周数据轴区域的大小
    zoomSpeed: 5,
    // 设定鼠标滚轮滚动单步调整的大小
    // linearLastPoint: false,    // 绘制当前价的闪烁点
    valueRangeBoundary: {
      show: false,
      //显示当前范围的价格边界
      dash: [10, 10],
      lineWidth: 1,
      highColor: '#FF4040',
      // 最高价颜色
      lowColor: '#1EB955' // 最低价颜色

    },
    tip: {
      highColor: '#FF4040',
      // 最高价颜色
      lowColor: '#1EB955',
      // 最低价颜色
      currPrice: {
        lineWidth: 1,
        // 当前价位线的粗细
        lineColor: 'rgba(0,0,0,0)',
        // 当前价位线的颜色
        labelBg: 'rgba(0,0,0,0)',
        // 当前价位的标签的背景色
        labelColor: 'rgba(0,0,0,0)',
        // 当前价位的标签的字体颜色
        labelHeight: 20 // 当前价位标签的高度

      }
    },
    crosshair: {
      snapToData: false,
      // 十字线是否被当前close价吸引
      color: '#979797',
      // 十字线颜色
      dash: [5, 5],
      lineWidth: 1,
      axisLabel: {
        xAxisLabelPos: 'bottom',
        yAxisLabelPos: 'right',
        fontSize: 12,
        height: 20,
        // 十字线标签高度
        bg: '#d8d8d8',
        // 十字线标签背景色
        color: '#666',
        // 十字线标签字体色
        horizPadding: 5,
        // 十字线标签水平空白间距
        posOffset: {
          // 十字线标签偏移
          yAxisLabel: {
            x: 0,
            y: 0
          },
          // 0 means auto
          xAxisLabel: {
            x: 0,
            y: 0
          }
        }
      },
      selectedPoint: {
        radius: [8, 5, 4],
        // 选中点的半径
        color: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)'] // 选中点的颜色

      }
    },
    grid: {
      bg: '#fff',
      // 网格线的颜色
      showHorizoneLines: true,
      showVerticalLines: true,
      limit: {
        y: {
          max: 8,
          min: 2
        }
      },
      // 网格线间隔调整限制
      lineColor: {
        x: '#f0f0f0',
        y: '#f0f0f0'
      },
      // 网格线的颜色
      span: {
        x: 120,
        y: 30
      },
      //
      unscalaTimeGap: 0
    },
    axis: {
      showBorder: false,
      // 显示图表border
      borderColor: '#000',
      bgColor: 'rgba(0,0,0,0)',
      // 坐标轴背景色
      // showRate: false,    // 显示百分比
      label: {
        top: {
          show: false,
          color: '#555',
          fontSize: 12,
          offset: {
            x: 0,
            y: 10
          },
          textAlign: 'center',
          // label text align,  Possible values: refrence to CanvasRenderingContext2D.textAlign
          textBaseline: 'top' // label text baseline,  Possible values: refrence to CanvasRenderingContext2D.textBaseline

        },
        right: {
          show: true,
          color: '#555',
          fontSize: 12,
          offset: {
            x: 10,
            y: 0
          },
          textAlign: 'left',
          textBaseline: 'middle'
        },
        bottom: {
          show: true,
          color: '#555',
          fontSize: 12,
          offset: {
            x: 0,
            y: 10
          },
          textAlign: 'center',
          textBaseline: 'top'
        },
        left: {
          show: false,
          color: '#555',
          fontSize: 12,
          offset: {
            x: 10,
            y: 0
          },
          textAlign: 'left',
          textBaseline: 'middle'
        }
      }
    },
    seriesStyle: {
      // 关于数据的样式
      baseValueLine: {
        dash: [5, 5],
        lineWidth: 1,
        color: '#2DB0F9'
      },
      candlestick: {
        // K线图的颜色
        block: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛块的颜色
        border: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛边框颜色
        wick: {
          up: '#FF4040',
          down: '#1EB955' // 蜡烛烛心颜色

        }
      },
      OHLC: {
        // 美国线的颜色
        up: '#FF4040',
        down: '#1EB955'
      },
      mountain: {
        // 山形线的颜色
        lineWidth: 1,
        // 价格线的粗细
        lineColor: '#2DB0F9',
        // 价格线的颜色
        gradientUp: 'rgba(45,176,249,0.15)',
        // 山形内部渐变色
        gradientDown: 'rgba(19,119,240,0.02)'
      },
      line: {
        // 线
        lineWidth: 1,
        // 价格线的粗细
        lineColor: '#2DB0F9' // 价格线的颜色

      },
      column: {
        block: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛块的颜色
        border: {
          up: '#FF4040',
          down: '#1EB955'
        }
      }
    }
  };
};

var Utils = {
  Safe: {
    dataCheck: function dataCheck(dataSource) {
      var data = dataSource.data;
      var series = dataSource.series;
      var maxIndex = 0;
      series.forEach(function (line) {
        for (var key in line) {
          if ((key.length === 1 || key.indexOf('index') > -1) && typeof line[key] === 'number') {
            if (line[key] > maxIndex) maxIndex = line[key];
          }
        }
      });

      if (dataSource.timeRanges) {
        for (var l = dataSource.timeRanges.length; l--;) {
          if (isNaN(dataSource.timeRanges[l][0]) || isNaN(dataSource.timeRanges[l][1])) {
            throw 'Time ranges contains NaN';
          }
        }
      }

      if (data.length === 0) throw 'Chart input data is empty';
      if (data[0].length <= maxIndex) throw 'Chart input data is length(' + data[0].length + ') is less than required data index(' + maxIndex + ')';
    }
  },
  Animation: {
    linear: function linear(dataSet1, dataSet2, valIndexes) {
      var diff = dataSet1.map(function (d1, index) {
        var data2 = dataSet2[index];
        var result = d1.slice();
        valIndexes.forEach(function (valIndex) {
          var diff = data2[valIndex] - result[valIndex];
          result[valIndex] = diff / 60;
        });
        return result;
      });
      return function () {
        dataSet1.forEach(function (d1, index) {
          valIndexes.forEach(function (valIndex) {
            d1[valIndex] += diff[index][valIndex];
          });
        });
      };
    }
  },
  Chart: {
    linkCharts: function linkCharts(charts) {
      charts.forEach(function (chart) {
        charts.forEach(function (otherChart) {
          if (chart !== otherChart) chart.linkedCharts.insert(otherChart);
        });
      });
    }
  },
  Math: {
    sum: function sum(lst) {
      var sum = 0;
      lst.forEach(function (item) {
        sum += item;
      });
      return sum;
    },
    // get Standard Deviation
    getSD: function getSD(data, avg) {
      if (avg === undefined) {
        avg = Utils.Math.sum(data) / data.length;
      }

      return Math.sqrt(Utils.Math.sum(data.map(function (item) {
        return Math.pow(item - avg, 2);
      })) / data.length);
    },
    iterOffsetN: function iterOffsetN(data, index, n, callback) {
      if (!n) {
        return;
      }

      var target = index + (Math.abs(n) - 1) * (n > 0 ? 1 : -1);
      if (target < 0) target = 0;else if (target > data.length - 1) target = data.length - 1;

      while (index !== target) {
        callback(data[index]);
        index += n > 0 ? 1 : -1;
      }

      callback(data[index]);
    },
    leftPad: function leftPad(n, width) {
      var zeros = [];

      while (width--) {
        zeros.push(0);
      }

      return zeros.join('').slice(0, zeros.length - n.toString().length) + n;
    },
    rightPad: function rightPad(n, width) {
      var nStr = n.toString().replace('-', '');
      var nStrArr = nStr.split('.');
      var precision = width - nStrArr[0].length - 1;
      return n.toFixed(precision >= 0 ? precision : 0);
    },
    distance: function distance(point1, point2) {
      return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    },
    valueFormat: function valueFormat(value, formatter) {
      var precision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

      if (value) {
        if (formatter && Object.prototype.toString.call(formatter) === '[object Function]') {
          return formatter(value);
        } else {
          return value.toFixed(precision >= 0 ? precision : 0);
        }
      }

      return '';
    }
  },
  Draw: {
    Basic: function Basic(ctx, func) {
      ctx.save();
      ctx.beginPath();
      func(ctx);
    },
    Fill: function Fill(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = style || 'black';
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    },
    Stroke: function Stroke(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.strokeStyle = style || 'black';
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    FillnStroke: function FillnStroke(ctx, func, fillStyle, strokeStyle) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = fillStyle || 'black';
      ctx.strokeStyle = strokeStyle || 'black';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    Text: function Text(ctx, func, fillStyle, fontStyle) {
      ctx.save();
      if (fontStyle) ctx.font = fontStyle;
      ctx.fillStyle = fillStyle || 'black';
      func(ctx);
      ctx.restore();
    }
  },
  Coord: {
    getDistance: function getDistance(p1, p2) {
      var xDiff = p1.clientX - p2.clientX;
      var yDiff = p1.clientY - p2.clientY;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },
    getDateStr: function getDateStr(date, noDate, noTime) {
      if (typeof date === 'number') date = new Date(date);
      var dateStr = Utils.Math.leftPad(date.getMonth() + 1, 2) + '/' + Utils.Math.leftPad(date.getDate(), 2);
      var timeStr = Utils.Math.leftPad(date.getHours(), 2) + ':' + Utils.Math.leftPad(date.getMinutes(), 2);
      var result = (noDate ? '' : dateStr) + ' ' + (noTime ? '' : timeStr);
      return result.trim();
    },

    /**
     *
     * @param {* dataSource for chart} data
     * @param {* timeRange to split chart} ranges
     * @param {* timeIndex in dataSource} tIndex
     */
    datafilterByTimeRanges: function datafilterByTimeRanges(data, ranges, tIndex) {
      var buckets = ranges.map(function () {
        return [];
      });
      var bucketIndex = 0;

      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var time = item[tIndex];

        if (time >= ranges[bucketIndex][0] && time <= ranges[bucketIndex][1]) {
          buckets[bucketIndex].push(item);
        } else {
          if (ranges[bucketIndex + 1] && time >= ranges[bucketIndex + 1][0]) {
            bucketIndex += 1;
            i--;
          }
        }
      }

      return buckets;
    },
    dataFilterByViewport: function dataFilterByViewport(data, viewport, style) {
      var displayWidth = viewport.right - viewport.left;
      var result = [];
      var pointerX = viewport.offset;
      var leftOffset = Number.MAX_VALUE;
      var rightOffset = Number.MIN_VALUE;

      for (var l = data.length; l--;) {
        data[l].x = null;

        if (pointerX >= -30 && pointerX <= displayWidth + 30) {
          data[l].x = displayWidth - pointerX + viewport.left;
          result.unshift(data[l]);
          if (l > rightOffset) rightOffset = l;
          if (l < leftOffset) leftOffset = l;
        }

        pointerX += viewport.barWidth;
      }

      return {
        data: result,
        leftOffset: leftOffset,
        rightOffset: rightOffset,
        viewport: viewport
      };
    },
    linearPixels2Actual: function linearPixels2Actual(length, coord) {
      return length * Math.abs(coord.actual[1] - coord.actual[0]) / Math.abs(coord.display[1] - coord.display[0]);
    },
    linearActual2Display: function linearActual2Display(val, coord) {
      return (val - coord.actual[0]) * (coord.display[1] - coord.display[0]) / (coord.actual[1] - coord.actual[0]) + coord.display[0];
    },
    linearDisplay2Actual: function linearDisplay2Actual(pos, coord) {
      return (pos - coord.display[0]) * (coord.actual[1] - coord.actual[0]) / (coord.display[1] - coord.display[0]) + coord.actual[0];
    },
    seekNeatPoints: function seekNeatPoints(range, count) {
      var diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      var precision = 1;

      if (diff > 1) {
        while (diff / precision > 10) {
          precision *= 10;
        }

        precision /= 10;
      } else {
        while (diff / precision < 10) {
          precision /= 10;
        }
      }

      var multiples = [1, 2, 5, 10, 20, 50];
      var points = []; // console.log(~~Math.log10(1/precision * 100))

      var fixPrecision = ~~Math.log10(1 / precision * 100);
      multiples.forEach(function (multiple) {
        var interval = multiple * precision;
        if (!interval) return;
        var newRange = [];
        var x = 0;

        if (range[1] < 0) {
          while (x >= range[0]) {
            if (x <= range[1]) newRange.push(x);
            x = Number((x - interval).toFixed(fixPrecision));
          }
        } else if (range[0] > 0) {
          while (x <= range[1]) {
            if (x >= range[0]) newRange.push(x);
            x = Number((x + interval).toFixed(fixPrecision));
          }
        } else {
          x -= interval;

          while (x >= range[0]) {
            newRange.push(x);
            x = Number((x - interval).toFixed(fixPrecision));
          }

          x = 0;

          while (x <= range[1]) {
            newRange.push(x);
            x = Number((x + interval).toFixed(fixPrecision));
          }
        }

        points.push([Number((newRange[0] - interval).toFixed(fixPrecision))].concat(newRange, [Number((newRange[newRange.length - 1] + interval).toFixed(fixPrecision))]));
      });
      if (!points.length) return [];
      if (points[points.length - 1].length === 5) points.push([points[points.length - 1][0], points[points.length - 1][2], points[points.length - 1][4]]);

      for (var i = 0; i < points.length; i++) {
        if (points[i].length <= count + 1 + 1) {
          return points[i];
        }
      }

      return points[points.length - 1];
    },
    seekNeatPointsOld: function seekNeatPointsOld(range, count) {
      var diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      var precision = 1;

      if (diff > 1) {
        while (diff / precision > 10) {
          precision *= 10;
        }

        precision /= 10;
      } else {
        while (diff / precision < 10) {
          precision /= 10;
        }
      }

      var multiples = [1, 2, 5, 10, 20, 50];
      var points = [];
      multiples.forEach(function (multiple) {
        var interval = multiple * precision;
        if (!interval) return;
        var newRange = [];
        var x = 0;

        if (range[1] < 0) {
          while (x >= range[0]) {
            if (x <= range[1]) newRange.push(x);
            x -= interval;
          }
        } else if (range[0] > 0) {
          while (x <= range[1]) {
            if (x >= range[0]) newRange.push(x);
            x += interval;
          }
        } else {
          x -= interval;

          while (x >= range[0]) {
            newRange.push(x);
            x -= interval;
          }

          x = 0;

          while (x <= range[1]) {
            newRange.push(x);
            x += interval;
          }
        }

        points.push(newRange);
      });
      if (!points.length) return [];
      if (points[points.length - 1].length === 3) points.push([points[points.length - 1][1]]);

      for (var i = 0; i < points.length - 1; i++) {
        if (points[i].length === count) {
          return points[i];
        } else if (points[i + 1].length < count) {
          return points[i + 1];
        }
      }

      return points[points.length - 1];
    },
    halfcandleWidth: function halfcandleWidth(columnWidth) {
      var half = ~~((columnWidth - 3) / 2);
      var sixtyPercent = ~~(columnWidth * 0.3);
      half = Math.min(sixtyPercent, half);
      if (half < 1) half = 1;
      return half;
    },
    calcYRange: function calcYRange(data, series) {
      var yMax = Number.MIN_VALUE;
      var yMin = Number.MAX_VALUE;
      data.forEach(function (d) {
        series.forEach(function (s) {
          var h = d[s.seriesType === 'candlestick' || s.seriesType === 'OHLC' ? s.highIndex : s.valIndex];
          var l = d[s.seriesType === 'candlestick' || s.seriesType === 'OHLC' ? s.lowIndex : s.valIndex];
          if (h > yMax) yMax = h;
          if (l < yMin) yMin = l;
        });
      });
      return [yMin, yMax];
    },

    /**
     *
     * @param {* max & min value of visible data} yRange
     * @param {* if the max/min data nestle to to/bottom of chart} touchTop
     * @param {* style config for chart} style
     * @param {* baseValue for symmetry chart} baseValue
     */
    adjustYRange: function adjustYRange(yRange, touchTop, style, viewport, baseValue) {
      // calc the vertical padding of grid
      var _yRange = _slicedToArray(yRange, 2),
          yMin = _yRange[0],
          yMax = _yRange[1];

      if (!touchTop) {
        var verticalPadding = Utils.Coord.linearPixels2Actual(style.grid.span.y, {
          display: [viewport.bottom, viewport.top],
          actual: [yMin, yMax]
        });
        yMin -= verticalPadding;
        yMax += verticalPadding;
      }

      var yActual = [yMin, yMax]; // enlarge the actual range of vertical coord when base value line is specified

      if (baseValue !== undefined && typeof baseValue === 'number') {
        var span = Math.max(Math.abs(baseValue - yMax), Math.abs(baseValue - yMin));
        yActual = [baseValue - span, baseValue + span];
      }

      if (yActual[0] === yActual[1]) {
        var offset = yActual[0] / 100;
        yActual[0] -= offset || (style.valuePrecision ? 1 / Math.pow(10, style.valuePrecision) : 0.001);
        yActual[1] += offset || (style.valuePrecision ? 1 / Math.pow(10, style.valuePrecision) : 0.001); // maybe better generate by precision
      }

      return yActual;
    }
  },
  Grid: {
    lineCount: function lineCount(display, limit, span) {
      var count = ~~(Math.abs(display[0] - display[1]) / span);
      return count > limit.max ? limit.max : count < limit.min ? limit.min : count;
    },
    calcGridLines: function calcGridLines(actual, lineCount, baseValue) {
      var lines = [];

      if (baseValue !== undefined && typeof baseValue === 'number') {
        // with base value lines
        var hm = Utils.Coord.seekNeatPoints([actual[0], baseValue], lineCount / 2 - 1);
        var fixPrecision = ~~Math.log10(1 / (actual[1] - actual[0]) * 100);
        lines = [].concat(_toConsumableArray(hm.slice(0, -2)), _toConsumableArray(hm.slice(0, -1).reverse().map(function (h) {
          return Number((2 * baseValue - h).toFixed(fixPrecision));
        }))); //  console.log(lines)
      } else {
        // no base value line specified
        lines = Utils.Coord.seekNeatPoints(actual, lineCount);
      }

      return lines;
    }
  }
};

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var now = +new Date();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

var Draw = {
  Basic: function Basic(ctx, func) {
    ctx.save();
    ctx.beginPath();
    func(ctx);
  },
  Fill: function Fill(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = style || 'black';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  },
  Stroke: function Stroke(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.strokeStyle = style || 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  FillnStroke: function FillnStroke(ctx, func, fillStyle, strokeStyle) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = fillStyle || 'black';
    ctx.strokeStyle = strokeStyle || 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  Text: function Text(ctx, func, fillStyle, fontStyle) {
    ctx.save();

    if (fontStyle) {
      ctx.font = fontStyle;
    }

    ctx.fillStyle = fillStyle || 'black';
    func(ctx);
    ctx.restore();
  }
};

function linePainter (ctx, data, coord, seriesConf, decorators) {
  var points = [];
  data.forEach(function (item) {
    points.push({
      x: item.x,
      y: Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y)
    });
  });
  Draw.Stroke(ctx, function (ctx) {
    ctx.lineWidth = seriesConf.style.lineWidth || 1;
    points.forEach(function (point, index) {
      if (!index) ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
    });
  }, seriesConf.style.lineColor);

  if (decorators && decorators.length) {
    decorators.forEach(function (d) {
      if (typeof d === 'function') {
        d(points, seriesConf);
      }
    });
  }
}

var calcOHLC = function calcOHLC(data, coord, seriesConf) {
  var res = {
    up: [],
    down: []
  };
  data.forEach(function (item, index) {
    var o = ~~Utils.Coord.linearActual2Display(item[seriesConf.openIndex], coord.y);
    var c = ~~Utils.Coord.linearActual2Display(item[seriesConf.closeIndex], coord.y);
    var h = ~~Utils.Coord.linearActual2Display(item[seriesConf.highIndex], coord.y);
    var l = ~~Utils.Coord.linearActual2Display(item[seriesConf.lowIndex], coord.y);
    var direction = c === o && index > 0 ? data[index - 1][seriesConf.closeIndex] < item[seriesConf.closeIndex] ? 'up' : 'down' : c < o ? 'up' : 'down';
    res[direction].push({
      x: ~~item.x,
      low: l,
      high: h,
      close: c,
      open: o
    });
  });
  return res;
};

function drawWicks(ctx, candles, wickColor) {
  for (var direction in candles) {
    Draw.Stroke(ctx, function (ctx) {
      candles[direction].forEach(function (line) {
        ctx.moveTo(line.x + 0.5, line.low + 0.5);
        ctx.lineTo(line.x + 0.5, line.high + 0.5);
      });
    }, wickColor[direction]);
  }
}

function drawCandle(ctx, candles, columnWidth, blockColor, borderColor) {
  var half = Utils.Coord.halfcandleWidth(columnWidth);

  var _loop = function _loop(direction) {
    Draw.FillnStroke(ctx, function (ctx) {
      candles[direction].forEach(function (candle) {
        ctx.rect(~~(candle.x - half) + 0.5, ~~Math.min(candle.open, candle.close) + 0.5, half * 2, ~~Math.abs(candle.open - candle.close)); // + 0.02 is for IE fix
      });
    }, blockColor[direction], borderColor[direction]);
  };

  for (var direction in candles) {
    _loop(direction);
  }
}

function candlestickPainter (ctx, data, coord, seriesConf) {
  var candles = calcOHLC(data, coord, seriesConf);
  drawWicks(ctx, candles, seriesConf.style.wick);
  drawCandle(ctx, candles, coord.viewport.barWidth, seriesConf.style.block, seriesConf.style.border);
}

function drawOHLC(ctx, OHLC, columnWidth, ohlcColor) {
  var half = Utils.Coord.halfcandleWidth(columnWidth);
  var lineWidth = ~~(columnWidth / 10) || 1;
  if (lineWidth > 1) lineWidth += ctx.lineWidth % 2 ? 0 : 1;

  var _loop = function _loop(direction) {
    Draw.Stroke(ctx, function (ctx) {
      ctx.lineWidth = lineWidth;
      var fixOffset = lineWidth % 2 ? 0.5 : 0;
      OHLC[direction].forEach(function (ohlc) {
        ctx.moveTo(ohlc.x + fixOffset, ohlc.low);
        ctx.lineTo(ohlc.x + fixOffset, ohlc.high);
        ctx.moveTo(~~(ohlc.x - half) + fixOffset, ohlc.open);
        ctx.lineTo(ohlc.x, ohlc.open);
        ctx.moveTo(~~(ohlc.x + half) + fixOffset, ohlc.close);
        ctx.lineTo(ohlc.x, ohlc.close);
      });
    }, ohlcColor[direction]);
  };

  for (var direction in OHLC) {
    _loop(direction);
  }
}

function ohlcPainter (ctx, data, coord, seriesConf) {
  var OHLC = calcOHLC(data, coord, seriesConf);
  drawOHLC(ctx, OHLC, coord.viewport.barWidth, seriesConf.style);
}

function columnPainter (ctx, data, coord, seriesConf, viewport) {
  var columns = {
    up: [],
    down: [],
    eq: []
  };
  data.forEach(function (item, index) {
    var val = item[seriesConf.valIndex];
    var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
    if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
    if (seriesConf.detect) columns[seriesConf.detect(item, index, data)].push(item);
  }); // a股K线下面的图换成矩形画法

  var coordY = seriesConf.linearMode ? {
    actual: [0, coord.y.actual[1]],
    display: coord.y.display
  } : coord.y;
  var half = Utils.Coord.halfcandleWidth(coord.viewport.barWidth);

  for (var direction in columns) {
    Draw.FillnStroke(ctx, function (ctx) {
      columns[direction].forEach(function (item) {
        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~(item.x - half) + 0.5, ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02); // + 0.02 is for IE fix
        } else {
          ctx.rect(~~(item.x - half) + 0.5, ~~coordY.display[0] + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - ~~coordY.display[0]) + 0.02);
        }
      });
    }, seriesConf.style.block[direction], seriesConf.style.border[direction]);
  }
}

function panesColumnPainter (ctx, panes, coord, seriesConf, bottom) {
  var columns = {
    up: [],
    down: [],
    eq: []
  };
  panes.forEach(function (pane, paneIndex) {
    pane.paneData.forEach(function (item, bIndex) {
      var val = item[seriesConf.valIndex];
      if (!bIndex) item.isFirst = true;
      if (bIndex === pane.paneData.length - 1 && paneIndex !== panes.length - 1) item.isLast = true; // make some changes to base define

      var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
      if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
      if (seriesConf.color.detect) columns[seriesConf.color.detect(item, bIndex, pane.paneData, paneIndex, panes)].push(item);
    });
  });

  var _loop = function _loop(direction) {
    Draw.FillnStroke(ctx, function (ctx) {
      columns[direction].forEach(function (item) {
        var half = seriesConf.lineWidth / 2 || 1;

        if (item.x + half > coord.x.display[1]) {
          item.isLast = true;
        }

        if (item.isFirst || item.isLast) {
          half = half / 2;
        }

        var posX = item.isFirst ? item.x : item.isLast ? item.x - half * 2 : item.x - half;
        var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;

        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~posX + 0.5, ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        } else {
          ctx.rect(~~posX + 0.5, ~~seriesConf.bottom ? seriesConf.bottom + 0.5 : 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        }
      });
    }, seriesConf.color[direction], seriesConf.color[direction]);
  };

  for (var direction in columns) {
    _loop(direction);
  }
}

function mountainPainter (ctx, data, coord, seriesConf) {
  var decorators = [];
  decorators.push(function gradientDecorator(points, seriesConf) {
    // draw gradient
    var gradient = ctx.createLinearGradient(0, 0, 0, coord.y.display[0] - coord.y.display[1]);
    gradient.addColorStop(0, seriesConf.style.gradientUp);
    gradient.addColorStop(1, seriesConf.style.gradientDown);
    Draw.Fill(ctx, function (ctx) {
      ctx.moveTo(points[0].x, coord.y.display[0]);
      points.forEach(function (point, index) {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, coord.y.display[0]);
      ctx.closePath();
    }, gradient);
  });
  return linePainter(ctx, data, coord, seriesConf, decorators);
}

var chartPainter = {
  line: linePainter,
  candlestick: candlestickPainter,
  OHLC: ohlcPainter,
  column: columnPainter,
  panesColumn: panesColumnPainter,
  mountain: mountainPainter
};

function dateFormatter(date) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  var formatObj = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  };
  var patternType = Object.prototype.toString.call(pattern);

  if (patternType === '[object Function]') {
    return pattern(date);
  } else if (patternType === '[object String]') {
    return pattern.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, function (match, p1) {
      var value = formatObj[p1];
      if (match.length > 0 && value < 10) value = "0".concat(value);
      return value;
    });
  } else {
    return 'YYYY-MM-DD HH:mm:ss'.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, function (match, p1) {
      var value = formatObj[p1];
      if (match.length > 0 && value < 10) value = "0".concat(value);
      return value;
    });
  }
}

var Render =
/*#__PURE__*/
function () {
  function Render(chart) {
    _classCallCheck(this, Render);

    this._chart = chart;
  }

  _createClass(Render, [{
    key: "rend",
    value: function rend() {
      this.drawGrid();
      this.drawSeries();
      this.drawAxis();
      this.drawAdditionalTips();
    }
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      var _this$_chart = this._chart,
          style = _this$_chart.style,
          ctx = _this$_chart.ctx,
          dataProvider = _this$_chart.dataProvider,
          viewport = _this$_chart.viewport;
      var coord = dataProvider.coord; // draw horizontal lines

      var hLines = coord.horizLines.slice(1, -1); // console.log(hLines)

      if (coord.horizLines && style.grid.showHorizoneLines) {
        Draw.Stroke(ctx, function (ctx) {
          hLines.forEach(function (y, index) {
            var ypos = index === hLines.length - 1 ? y.display : y.display - 1;
            ctx.moveTo(viewport.left, ypos + 0.5);
            ctx.lineTo(viewport.right, ypos + 0.5);
          });
        }, style.grid.lineColor.x);
      }

      var vLines = coord.verticalLines; // draw vertical lines

      if (coord.verticalLines && style.grid.showVerticalLines) {
        var lineCount = coord.verticalLines.length;
        Draw.Stroke(ctx, function (ctx) {
          vLines.forEach(function (val, ind) {
            ctx.moveTo(val.display + (ind === lineCount - 1 ? -1.5 : 0.5), viewport.top);
            ctx.lineTo(val.display + (ind === lineCount - 1 ? -1.5 : 0.5), viewport.bottom);
          });
        }, style.grid.lineColor.y);
      }

      if (style.axis.showBorder) {
        Draw.Stroke(ctx, function (ctx) {
          ctx.moveTo(viewport.left + 0.5, viewport.top);
          ctx.lineTo(viewport.left + 0.5, viewport.bottom);
          ctx.moveTo(viewport.right - 0.5, viewport.top);
          ctx.lineTo(viewport.right - 0.5, viewport.bottom);
          ctx.moveTo(viewport.left, viewport.top + 0.5);
          ctx.lineTo(viewport.right, viewport.top + 0.5);
          ctx.moveTo(viewport.left, viewport.bottom - 0.5);
          ctx.lineTo(viewport.right, viewport.bottom - 0.5);
        }, style.axis.borderColor);
      }
    }
  }, {
    key: "drawSeries",
    value: function drawSeries() {
      var _this$_chart2 = this._chart,
          type = _this$_chart2.type,
          ctx = _this$_chart2.ctx,
          dataProvider = _this$_chart2.dataProvider,
          viewport = _this$_chart2.viewport,
          dataSource = _this$_chart2.dataSource,
          seriesInfo = _this$_chart2.seriesInfo,
          style = _this$_chart2.style;
      var series = seriesInfo.series,
          valueIndex = seriesInfo.valueIndex;
      var coord = dataProvider.coord,
          filteredData = dataProvider.filteredData,
          panes = dataProvider.panes;
      series.map(function (s) {
        var seriesConf;

        if (s.seriesType && chartPainter[s.seriesType] && s.seriesType !== 'column') {
          seriesConf = Object.assign({}, s, {
            style: style.seriesStyle[s.seriesType]
          });
          chartPainter[s.seriesType](ctx, filteredData.data, coord, seriesConf, viewport);
        }

        if (s.seriesType === 'column') {
          seriesConf = Object.assign({}, s, {
            style: style.seriesStyle[s.seriesType]
          });

          if (type === 'unscalable') {
            chartPainter.panesColumn(ctx, panes, coord, seriesConf, viewport);
          }

          if (type === 'scalable') {
            chartPainter.column(ctx, filteredData.data, coord, seriesConf, viewport);
          }
        }
      });
    }
  }, {
    key: "drawAxis",
    value: function drawAxis() {
      var _this$_chart3 = this._chart,
          type = _this$_chart3.type,
          ctx = _this$_chart3.ctx,
          style = _this$_chart3.style,
          dataProvider = _this$_chart3.dataProvider,
          dataSource = _this$_chart3.dataSource,
          seriesInfo = _this$_chart3.seriesInfo,
          originHeight = _this$_chart3.originHeight,
          originWidth = _this$_chart3.originWidth,
          viewport = _this$_chart3.viewport;
      var coord = dataProvider.coord;
      this.axisClean(); // draw labels

      var rates = {
        up: [],
        down: [] // y-axis label

      };
      ['left', 'right'].forEach(function (direction) {
        if (style.axis.label[direction].show) {
          Draw.Text(ctx, function (ctx) {
            coord.horizLines.forEach(function (y, index) {
              var val = Utils.Math.valueFormat(y.actual, style.valueFormatter, style.valuePrecision);
              var xOffset = style.axis.label[direction].offset.x;
              var yPos = y.display + style.axis.label[direction].offset.y;
              if (yPos < 10) yPos += 10;
              if (yPos > originHeight - 10) yPos -= 10;
              ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family;
              ctx.textAlign = style.axis.label[direction].textAlign;
              ctx.textBaseline = style.axis.label[direction].textBaseline;
              ctx.fillText(val, viewport[direction] + xOffset, yPos + style.axis.label[direction].offset.y);
            });
          }, style.axis.label[direction].color);
        }
      });
      ['top', 'bottom'].forEach(function (direction) {
        if (style.axis.label[direction].show) {
          if (type === 'scalable') {
            // scalable
            Draw.Text(ctx, function (ctx) {
              ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family;
              ctx.textAlign = style.axis.label[direction].textAlign;
              ctx.textBaseline = style.axis.label[direction].textBaseline;
              coord.verticalLines.forEach(function (x) {
                ctx.fillText(dateFormatter(x.actual, style.dateFormat), x.display + style.axis.label[direction].offset.x, viewport[direction] + style.axis.label[direction].offset.y);
              });
            }, style.axis.label[direction].color);
          } else {
            seriesInfo.timeRanges.forEach(function (range, index) {
              var width = viewport.right - style.padding.left;
              var displayRange = [index * width / seriesInfo.timeRanges.length, (index + 1) * width / seriesInfo.timeRanges.length];

              if (seriesInfo.timeRangesRatio) {
                var widthRatio = seriesInfo.timeRangesRatio;
                var prevRatio = widthRatio.slice(0, index).reduce(function (acc, x) {
                  return acc + x;
                }, 0);
                var ratio = widthRatio[index];
                var left = Math.round(style.padding.left + prevRatio * width);
                var right = Math.round(left + ratio * width);
                displayRange = [left, right];
              }

              Draw.Text(ctx, function (ctx) {
                ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family;
                ctx.textAlign = style.axis.label[direction].textAlign;
                ctx.textBaseline = style.axis.label[direction].textBaseline;
                ctx.fillText(dateFormatter(range[0], style.dateFormat), displayRange[0] + 5, viewport[direction] + style.axis.label[direction].offset.y);
                var lastDateStr = dateFormatter(range[1], style.dateFormat);
                var strWidth = ctx.measureText(lastDateStr).width;
                ctx.fillText(lastDateStr, displayRange[1] - strWidth - 5, viewport[direction] + style.axis.label[direction].offset.y);
              }, style.axis.label[direction].color);
            });
          }
        }
      }); // Draw.Text(ctx, ctx => {
      //   if (style.axis.showRate) {
      //     var rateX = yAxis.flag > 0 ? 0 : viewport.right
      //     coord.horizLines.forEach((y, index) => {
      //       var val = ((y.actual - seriesInfo.baseValue) / seriesInfo.baseValue)
      //       var xOffset = ctx.measureText(val.toFixed(2) + '%').width + style.axis.label.yAxis.offset.x
      //       var yPos = y.display + style.axis.label.yAxis.offset.y
      //       if (yPos < 10)
      //         yPos += 10
      //       if (yPos > originHeight - 10)
      //         yPos -= 10
      //       if (val === 0)
      //         ctx.fillText(val.toFixed(2) + '%',
      //           rateX + style.axis.scaleLength + xOffset * yAxis.flag,
      //           yPos)
      //       else {
      //         rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
      //           rateX + style.axis.scaleLength + xOffset * yAxis.flag,
      //           yPos
      //         ])
      //       }
      //     })
      //   }
      // }, style.axis.labelColor)

      for (var direction in rates) {
        Draw.Text(ctx, function (ctx) {
          rates[direction].forEach(function (item) {
            ctx.fillText(item[0], item[1], item[2]);
          });
        }, style.seriesStyle.OHLC[direction]);
      }
    }
  }, {
    key: "drawAdditionalTips",
    value: function drawAdditionalTips() {
      var _this$_chart4 = this._chart,
          seriesInfo = _this$_chart4.seriesInfo,
          dataSource = _this$_chart4.dataSource,
          ctx = _this$_chart4.ctx,
          style = _this$_chart4.style,
          dataProvider = _this$_chart4.dataProvider,
          viewport = _this$_chart4.viewport;
      var filteredData = dataProvider.filteredData,
          coord = dataProvider.coord;

      if (seriesInfo.baseValue !== undefined && typeof seriesInfo.baseValue === 'number') {
        var y = ~~Utils.Coord.linearActual2Display(seriesInfo.baseValue, coord.y);
        Draw.Stroke(ctx, function (ctx) {
          ctx.lineWidth = style.seriesStyle.baseValueLine.lineWidth;
          var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0;
          ctx.setLineDash(style.seriesStyle.baseValueLine.dash); // console.log('baseline', y + fixOffset)

          ctx.moveTo(style.padding.left, y + fixOffset);
          ctx.lineTo(viewport.right, y + fixOffset);
        }, style.seriesStyle.baseValueLine.color);
      } // draw current price
      // const mainSeries = seriesInfo.series.find(s => s.main)


      var mainSeries = seriesInfo.series[seriesInfo.mainSeriesIndex || 0];

      if (dataSource.length > 0) {
        if (mainSeries) {
          var x = style.axis.yAxisPos === 'right' ? viewport.right : 0;
          var width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left;
          var last = dataSource[dataSource.length - 1];
          var value = last[mainSeries.closeIndex || mainSeries.valIndex];

          var _y = ~~Utils.Coord.linearActual2Display(value, coord.y);

          Draw.Stroke(ctx, function (ctx) {
            ctx.lineWidth = style.tip.currPrice.lineWidth;
            var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0;
            ctx.moveTo(style.padding.left, _y + fixOffset);
            ctx.lineTo(viewport.right, _y + fixOffset);
          }, style.tip.currPrice.lineColor);
          Draw.Fill(ctx, function (ctx) {
            ctx.rect(x, _y - style.tip.currPrice.labelHeight / 2, width, style.tip.currPrice.labelHeight);
          }, style.tip.currPrice.labelBg);
          Draw.Text(ctx, function (ctx) {
            ctx.fillText(Utils.Math.valueFormat(value, style.valueFormatter, style.valuePrecision), x + style.axis.scaleLength + style.axis.label.right.offset.x, _y + 5);
          }, style.tip.currPrice.labelColor);
        }
      } // draw value range boundary


      if (style.valueRangeBoundary.show && mainSeries && filteredData && filteredData.data && filteredData.data.length) {
        var max = filteredData.data[0];
        var min = filteredData.data[0];

        if (mainSeries.seriesType === 'candlestick' || mainSeries.seriesType === 'OHLC') {
          var highIndex = mainSeries.highIndex;
          var lowIndex = mainSeries.lowIndex;
        } else {
          highIndex = mainSeries.valIndex;
          lowIndex = mainSeries.valIndex;
        }

        filteredData.data.forEach(function (item) {
          if (item[highIndex] > max[highIndex]) max = item;
          if (item[lowIndex] < min[lowIndex]) min = item;
        });
        var maxVal = Utils.Math.valueFormat(max[highIndex], style.valueFormatter, style.valuePrecision);
        var maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5;
        var minVal = Utils.Math.valueFormat(min[lowIndex], style.valueFormatter, style.valuePrecision);
        var minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5;
        Draw.Stroke(ctx, function (ctx) {
          if (style.valueRangeBoundary.dash) {
            ctx.setLineDash(style.valueRangeBoundary.dash);
          }

          if (style.valueRangeBoundary.lineWidth) {
            ctx.lineWidth = style.valueRangeBoundary.lineWidth;
          }

          var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0;
          ctx.moveTo(style.padding.left, maxY + fixOffset);
          ctx.lineTo(viewport.right, maxY + fixOffset);
        }, style.valueRangeBoundary.highColor);
        Draw.Stroke(ctx, function (ctx) {
          if (style.valueRangeBoundary.dash) {
            ctx.setLineDash(style.valueRangeBoundary.dash);
          }

          if (style.valueRangeBoundary.lineWidth) {
            ctx.lineWidth = style.valueRangeBoundary.lineWidth;
          }

          var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0;
          ctx.moveTo(style.padding.left, minY + fixOffset);
          ctx.lineTo(viewport.right, minY + fixOffset);
        }, style.valueRangeBoundary.lowColor);
        ['left', 'right'].forEach(function (direction) {
          if (style.axis.label[direction].show) {
            Draw.Text(ctx, function (ctx) {
              var width = ctx.measureText(maxVal).width;
              ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family;
              ctx.textAlign = style.axis.label[direction].textAlign;
              ctx.textBaseline = style.axis.label[direction].textBaseline;
              ctx.fillText(maxVal, viewport[direction] + style.axis.label[direction].offset.x, maxY);
            }, style.valueRangeBoundary.highColor);
            Draw.Text(ctx, function (ctx) {
              var width = ctx.measureText(minVal).width;
              ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family;
              ctx.textAlign = style.axis.label[direction].textAlign;
              ctx.textBaseline = style.axis.label[direction].textBaseline;
              ctx.fillText(minVal, viewport[direction] + style.axis.label[direction].offset.x, minY);
            }, style.valueRangeBoundary.lowColor);
          }
        });
      }
    }
  }, {
    key: "axisClean",
    value: function axisClean(chart) {
      var _this$_chart5 = this._chart,
          ctx = _this$_chart5.ctx,
          style = _this$_chart5.style,
          originHeight = _this$_chart5.originHeight,
          originWidth = _this$_chart5.originWidth,
          viewport = _this$_chart5.viewport; // clear axis region
      // 用bg先刷一次 防止AXIS颜色设置成透明时 不能正确截取图表

      Draw.Fill(ctx, function (ctx) {
        ctx.rect(0, 0, originWidth, style.padding.top);
        ctx.rect(0, 0, style.padding.left, originHeight);
        ctx.rect(viewport.right, 0, style.padding.right, originHeight);
        ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom);
      }, style.grid.bg);
      Draw.Fill(ctx, function (ctx) {
        ctx.rect(0, 0, originWidth, style.padding.top);
        ctx.rect(0, 0, style.padding.left, originHeight);
        ctx.rect(viewport.right, 0, style.padding.right, originHeight);
        ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom);
      }, style.axis.bgColor);
    }
  }]);

  return Render;
}();

var originPosMap = {
  left: [0, 0.5],
  top: [0.5, 0],
  right: [1, 0.5],
  bottom: [0.5, 1],
  lefttop: [0, 0],
  righttop: [1, 0],
  leftbottom: [0, 1],
  rightbottom: [1, 1],
  center: [0.5, 0.5] // originPos: provide origin in the position of the label

};
function textLabelPainter(_ref) {
  var ctx = _ref.ctx,
      text = _ref.text,
      origin = _ref.origin,
      originPos = _ref.originPos,
      bound = _ref.bound,
      style = _ref.style,
      font = _ref.font;
  var labelWidth;
  Utils.Draw.Text(ctx, function (ctx) {
    ctx.font = style.fontSize + 'px ' + font.family;
    labelWidth = ctx.measureText(text).width + style.horizPadding * 2;
  }); // realOrigin origin can be use for CanvasRenderingContext2D.rect() {x:x,y:y}

  var realOrigin = {
    x: origin.x - originPosMap[originPos][0] * labelWidth,
    y: origin.y - originPosMap[originPos][1] * style.height
  };
  realOrigin.x = realOrigin.x < 0 ? 0 : realOrigin.x + labelWidth > bound.xMax ? bound.xMax - labelWidth : realOrigin.x;
  Utils.Draw.Fill(ctx, function (ctx) {
    ctx.rect(realOrigin.x, realOrigin.y, labelWidth, style.height);
  }, style.bg); // draw x label text

  var textX = realOrigin.x + style.horizPadding;
  var textY = realOrigin.y + style.height / 2;
  Utils.Draw.Text(ctx, function (ctx) {
    ctx.textBaseline = 'middle';
    ctx.font = style.fontSize + 'px ' + font.family;
    ctx.fillText(text, textX, textY);
  }, style.color);
}

var rafThrottle = function rafThrottle(callback) {
  var requestId = null;
  var lastArgs;

  var later = function later(context) {
    return function () {
      requestId = null;
      callback.apply(context, lastArgs);
    };
  };

  var throttled = function throttled() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;

    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = function () {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};

function genEvent(chart, type) {
  var e = {};
  chart.eventInfo = {
    selectedItem: null,
    selectedIndex: null,
    yPos: null,
    xPos: null,
    dragStart: {
      offset: null
    },
    pinchStart: {
      offset: null,
      center: null
    }
  };
  Object.entries(eventSource[type]).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        func = _ref2[1];

    e[name] = rafThrottle(function (event) {
      if (!event) {
        return;
      }

      func(chart, event);

      if (chart.linkedCharts.size) {
        _toConsumableArray(chart.linkedCharts).forEach(function (linkedChart) {
          func(linkedChart, event, true);
        });
      }
    });
  });
  return e;
}
var eventSource = {
  scalable: {
    mouseMoveEvent: function mouseMoveEvent() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot', 'toolTip'], args);
    },
    mouseLeaveEvent: function mouseLeaveEvent() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _processEventUnits(['clean'], args);
    },
    mouseDownEvent: function mouseDownEvent() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _processEventUnits(['dragStart'], args);
    },
    panStartEvent: function panStartEvent() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      _processEventUnits(['panStart'], args);
    },
    panMoveEvent: function panMoveEvent() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      _processEventUnits(['panMove'], args);
    },
    panEndEvent: function panEndEvent() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      _processEventUnits(['panEnd'], args);
    },
    mouseUpEvent: function mouseUpEvent() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      _processEventUnits(['dragEnd'], args);
    },
    mouseWheelEvent: function mouseWheelEvent() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      _processEventUnits(['mouseWheel'], args);
    },
    pinchStartEvent: function pinchStartEvent() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      _processEventUnits(['pinchStart'], args);
    },
    pinchMoveEvent: function pinchMoveEvent() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      _processEventUnits(['pinchMove'], args);
    },
    pinchEndEvent: function pinchEndEvent() {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      _processEventUnits(['pinchEnd'], args);
    }
  },
  unscalable: {
    mouseMoveEvent: function mouseMoveEvent() {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot'], args);
    },
    mouseLeaveEvent: function mouseLeaveEvent() {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      _processEventUnits(['clean'], args);
    }
  }
};
var events = {
  crosshair: function crosshair(chart, e, linked) {
    if (!linked && (e.localY < chart.viewport.top || e.localY > chart.viewport.bottom)) return;
    if (e.localX < chart.viewport.left || e.localX > chart.viewport.right) return;

    var _ref3 = getNearest[chart.type](chart, e.localX) || [null, null],
        _ref4 = _slicedToArray(_ref3, 2),
        selectedItem = _ref4[0],
        selectedIndex = _ref4[1];

    if (chart.eventInfo) {
      chart.eventInfo.selectedItem = selectedItem;
      chart.eventInfo.selectedIndex = selectedIndex;
    }

    if (!chart.eventInfo.selectedItem) return;
    var mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0];
    Utils.Draw.Stroke(chart.iaCtx, function (ctx) {
      ctx.lineWidth = chart.style.crosshair.lineWidth || 1;
      ctx.setLineDash(chart.style.crosshair.dash); // verticalPos = e.localX

      var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0; // draw horizontal line

      var snapPointIndex;

      if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]) {
        snapPointIndex = mainSeries[chart.style.crosshair.snapProperty];
      } else {
        snapPointIndex = mainSeries['valIndex'];
      } // if(!snapPointIndex) return


      if (!linked) {
        chart.eventInfo.yPos = chart.style.crosshair.snapToData && snapPointIndex && chart.eventInfo.selectedItem ? ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) : e.localY;
        ctx.moveTo(chart.viewport.left, ~~chart.eventInfo.yPos + fixOffset);
        ctx.lineTo(chart.viewport.right, ~~chart.eventInfo.yPos + fixOffset);
      }

      chart.eventInfo.xPos = chart.eventInfo.selectedItem.x; // draw vertical line

      ctx.moveTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.top);
      ctx.lineTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.bottom);
    }, chart.style.crosshair.color);
  },
  axisLabel: function axisLabel(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem) return; // find the horizontal label width

    var hoverTime = chart.eventInfo.selectedItem[chart.seriesInfo.timeIndex];
    var hoverTimeStr = dateFormatter(hoverTime, chart.style.dateFormat);
    var mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0];
    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverTimeStr,
      origin: {
        x: chart.style.crosshair.axisLabel.posOffset.xAxisLabel.x + chart.eventInfo.selectedItem.x,
        y: chart.style.crosshair.axisLabel.posOffset.xAxisLabel.y + (chart.style.crosshair.axisLabel.xAxisLabelPos === 'bottom' ? chart.viewport.bottom : chart.viewport.top - chart.style.crosshair.axisLabel.height)
      },
      originPos: chart.style.crosshair.axisLabel.xAxisLabelPos === 'bottom' ? 'top' : 'bottom',
      bound: {
        xMax: chart.originWidth,
        yMax: chart.originHeight
      },
      style: chart.style.crosshair.axisLabel,
      font: chart.style.font
    });
    if (linked) return;
    var snapPointIndex;

    if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]) {
      snapPointIndex = mainSeries[chart.style.crosshair.snapProperty];
    } else {
      snapPointIndex = mainSeries['valIndex'];
    }

    if (!snapPointIndex) return;
    var horizPos = chart.style.crosshair.snapToData && chart.eventInfo.selectedItem ? ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) : e.localY;
    var hoverValue;

    if (!linked) {
      hoverValue = Utils.Math.valueFormat(Utils.Coord.linearDisplay2Actual(horizPos, chart.dataProvider.coord.y), chart.style.valueFormatter, chart.style.valuePrecision);
    } else {
      hoverValue = 0;
    }

    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverValue,
      origin: {
        x: chart.style.crosshair.axisLabel.posOffset.yAxisLabel.x + (chart.style.crosshair.axisLabel.yAxisLabelPos === 'right' ? chart.viewport.right : 0),
        y: chart.style.crosshair.axisLabel.posOffset.yAxisLabel.y + horizPos
      },
      originPos: chart.style.crosshair.axisLabel.yAxisLabelPos === 'right' ? 'left' : 'right',
      bound: {
        xMax: chart.originWidth,
        yMax: chart.originHeight
      },
      style: chart.style.crosshair.axisLabel,
      font: chart.style.font
    });
  },
  selectDot: function selectDot(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem || !chart.style.crosshair.snapToData) return;
    var mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0];
    var snapPointIndex;

    if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]) {
      snapPointIndex = mainSeries[chart.style.crosshair.snapProperty];
    } else {
      snapPointIndex = mainSeries['valIndex'];
    }

    if (!snapPointIndex) return;
    var radius = chart.style.crosshair.selectedPoint.radius;
    chart.style.crosshair.selectedPoint.color.forEach(function (color, index) {
      Utils.Draw.Fill(chart.iaCtx, function (ctx) {
        ctx.arc(chart.eventInfo.selectedItem.x + 0.5, Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) - 1.5, radius[index], 0, 2 * Math.PI);
      }, color);
    });
  },
  toolTip: function toolTip(chart, e, linked) {
    if (!chart.eventInfo.selectedItem) return;
    chart.toolTipLayer.innerHTML = '';
    var d = document.createElement('div');
    if (!chart.style.crosshair.toolTip || Object.prototype.toString.call(chart.style.crosshair.toolTip) !== '[object Function]') return;
    chart.style.crosshair.toolTip(chart.eventInfo, function (dom) {
      d.innerHTML = dom;
      d.style.position = 'absolute';
      d.style.left = 0;
      d.style.visibility = 'hidden';
      d.style.top = 0;
      chart.toolTipLayer.appendChild(d);

      var _calcBoxPositionInBou = calcBoxPositionInBounding({
        x: chart.eventInfo.xPos,
        y: chart.eventInfo.yPos
      }, {
        width: d.clientWidth,
        height: d.clientHeight
      }, {
        width: chart.toolTipLayer.clientWidth,
        height: chart.toolTipLayer.clientHeight
      }),
          left = _calcBoxPositionInBou.left,
          top = _calcBoxPositionInBou.top;

      d.style.left = left + 'px';
      d.style.top = top + 'px';
      d.style.visibility = 'visible';
    }); // console.log(d, d.offsetHeight, d.offsetWidth)
  },
  panStart: function panStart(chart, e, linked) {
    if (linked) return;
    chart.eventInfo.dragStart.offset = chart.viewport.offset;
  },
  panMove: function panMove(chart, e, linked) {
    if (linked) return;
    var newOffset = chart.eventInfo.dragStart.offset - e.deltaX; // console.log('move', chart.eventInfo.dragStart.offset, e.deltaX, newOffset, chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5)

    if (e.deltaX < 0 && newOffset < chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5 || e.deltaX > 0 && newOffset > chart.viewport.barWidth * -(chart.dataSource.length - 5)) {
      chart.viewport.offset = newOffset;
      chart.rerender();
    }
  },
  panEnd: function panEnd(chart, e, linked) {
    if (linked) return;
    chart.eventInfo.dragStart.offset = chart.viewport.offset;
  },
  pinchStart: function pinchStart(chart, e, linked) {
    if (linked) return;
    chart.eventInfo.pinchStart.offset = chart.viewport.offset;
    chart.eventInfo.pinchStart.barWidth = chart.viewport.barWidth;
    chart.eventInfo.pinchStart.center = e.center;

    var _ref5 = getNearest[chart.type](chart, e.center.x) || [null, null],
        _ref6 = _slicedToArray(_ref5, 2),
        selectedItem = _ref6[0],
        selectedIndex = _ref6[1];

    chart.eventInfo.selectedItem = selectedItem;
    chart.eventInfo.selectedIndex = selectedIndex;
  },
  pinchMove: function pinchMove(chart, e, linked) {
    if (linked) return;

    if (!chart.eventInfo.selectedItem || !chart.eventInfo.selectedIndex) {
      return;
    }

    var zoomScale = e.scale - 1;
    var offsetIndex = chart.dataSource.length - chart.eventInfo.selectedIndex - 1;
    var oldBarWidth = chart.eventInfo.pinchStart.barWidth; // const scaleDivision = 100 / chart.style.wheelZoomSpeed

    var scaleDivision = 1;

    if (chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) > 4 && chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth = chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision);
      chart.viewport.offset = chart.eventInfo.pinchStart.offset - offsetIndex * oldBarWidth * (zoomScale / scaleDivision);
    }

    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0;
    }

    chart.rerender();
  },
  pinchEnd: function pinchEnd(chart, e, linked) {
    if (linked) return;
  },
  pinchEvent: function pinchEvent(pinchPoint, scale) {},
  clean: function clean(chart, e, linked) {
    if (chart.toolTipLayer) {
      chart.toolTipLayer.innerHTML = '';
    }

    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight);
  },
  pinch: function pinch(chart, e, linked) {},
  mouseWheel: function mouseWheel(chart, e, linked) {
    if (linked) return;
    var zoomScale = Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY));

    var _ref7 = getNearest[chart.type](chart, e.localX) || [null, null],
        _ref8 = _slicedToArray(_ref7, 2),
        selectedItem = _ref8[0],
        selectedIndex = _ref8[1];

    if (!selectedIndex || !selectedItem) {
      return;
    }

    var offsetIndex = chart.dataSource.length - selectedIndex - 1;
    var oldViewport = chart.viewport.barWidth;
    var scaleDivision = 100 / chart.style.zoomSpeed;

    if (chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) > 4 && chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth += oldViewport * (zoomScale / scaleDivision);
      chart.viewport.offset -= offsetIndex * oldViewport * (zoomScale / scaleDivision);
    }

    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0;
    }

    chart.rerender();
  }
};
var getNearest = {
  scalable: function scalable(chart, xpos) {
    var filteredData = chart.dataProvider.filteredData.data.map(function (item) {
      return item.x;
    }); // for (let l = filteredData.length - 1; l >= 0; l--) {
    //   if (Math.abs(xpos - filteredData[l]) <= chart.viewport.barWidth / 2) {
    //     return [chart.dataSource[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset]
    //   }
    // }

    for (var l = filteredData.length - 1; l > 0; l--) {
      if ((xpos - filteredData[l]) * (xpos - filteredData[l - 1]) < 0) {
        if (Math.abs(xpos - filteredData[l]) < Math.abs(xpos - filteredData[l - 1])) {
          return [chart.dataSource[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset];
        } else {
          return [chart.dataSource[l - 1 + chart.dataProvider.filteredData.leftOffset], l - 1 + chart.dataProvider.filteredData.leftOffset];
        }
      }
    }
  },
  unscalable: function unscalable(chart, xpos) {
    var rangeIndex = 0; // multiRange charts has diffrent scales in diffrent ratio parts

    if (chart.seriesInfo.timeRangesRatio) {
      var widthRatio = chart.seriesInfo.timeRangesRatio;
      var width = chart.viewport.right - chart.viewport.left;

      for (var i = 0; i < widthRatio.length; i++) {
        var ratio = widthRatio[i];
        var prevRatio = widthRatio.slice(0, i).reduce(function (acc, x) {
          return acc + x;
        }, 0);
        var left = Math.round(chart.viewport.left + prevRatio * width);
        var right = Math.round(left + ratio * width);

        if (xpos >= left && xpos <= right) {
          rangeIndex = i;
          break;
        }
      }
    }

    var filteredData = chart.dataProvider.panes.map(function (pane) {
      return pane.paneData;
    }); // console.log(filteredData,rangeIndex)

    for (var l = filteredData[rangeIndex].length - 1; l > 0; l--) {
      if ((xpos - filteredData[rangeIndex][l].x) * (xpos - filteredData[rangeIndex][l - 1].x) < 0) {
        if (Math.abs(xpos - filteredData[rangeIndex][l].x) < Math.abs(xpos - filteredData[rangeIndex][l - 1].x)) {
          return [filteredData[rangeIndex][l], l];
        } else {
          return [filteredData[rangeIndex][l - 1], l - 1];
        }
      }
    }
  }
};

function _processEventUnits(units, args) {
  units.forEach(function (name) {
    return events[name] && events[name].apply(events, _toConsumableArray(args));
  });
}

function calcBoxPositionInBounding(origin, box, bounding) {
  var minMargin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
  var horizPos, verticalPos;

  if (origin.x + box.width + minMargin < bounding.width) {
    //can set in right
    horizPos = origin.x + minMargin;
  } else {
    // set in left
    if (origin.x - box.width - minMargin < 0) {
      // alert('tooltip is too wide to set in chart')
      horizPos = bounding.width - box.width - minMargin;
    } else {
      horizPos = origin.x - box.width - minMargin;
    }
  }

  if (origin.y + box.height + minMargin < bounding.height) {
    //can set in bottom
    verticalPos = origin.y + minMargin;
  } else {
    if (origin.y - box.height - minMargin < 0) {
      console.warn('tooltip is too high to set in chart');
      verticalPos = bounding.height - box.height - minMargin;
    } else {
      verticalPos = origin.y - box.height - minMargin;
    } // set in top

  }

  return {
    left: horizPos,
    top: verticalPos
  };
}

var DataProvider =
/*#__PURE__*/
function () {
  function DataProvider(dataSource, chartType, chart) {
    _classCallCheck(this, DataProvider);

    this._dataSource = dataSource;
    this._seriesInfo = chart.seriesInfo;
    this._chartType = chartType;
    this._chart = chart;
    this._panes = null;
    this._filteredData = null;
    this._coord = null;

    if (this._dataSource && this._dataSource.length) {
      this.produce();
    } // this._filteredData

  }

  _createClass(DataProvider, [{
    key: "produce",
    value: function produce() {
      if (this._chartType === 'unscalable') {
        this.genPanes();
      } else {
        this.filterData();
      }

      this.genCoord();
    }
  }, {
    key: "genPanes",
    value: function genPanes() {
      var _this$_chart = this._chart,
          style = _this$_chart.style,
          viewport = _this$_chart.viewport;
      var _this$_seriesInfo = this._seriesInfo,
          timeIndex = _this$_seriesInfo.timeIndex,
          timeRanges = _this$_seriesInfo.timeRanges,
          timeRangesRatio = _this$_seriesInfo.timeRangesRatio;
      var chartWidth = viewport.right - viewport.left;
      var paneData = Utils.Coord.datafilterByTimeRanges(this._dataSource, timeRanges, timeIndex);
      var paneCoords = timeRanges.map(function (range, index) {
        // calc each panes position-x
        var left, right;

        if (timeRangesRatio) {
          var prevRatio = timeRangesRatio.slice(0, index).reduce(function (acc, x) {
            return acc + x;
          }, 0);
          left = Math.round(style.padding.left + prevRatio * chartWidth);
          right = Math.round(left + timeRangesRatio[index] * chartWidth);
        } else {
          var coordWidth = chartWidth / timeRanges.length;
          left = style.padding.left + coordWidth * index;
          right = left + coordWidth;
        }

        return {
          x: {
            display: [left, right],
            actual: [range[0], range[1]]
          }
        };
      }); // calc display position x of each visiable point

      if (!style.seriesInfo.xByIndex) {
        paneData.forEach(function (pane, index) {
          pane.forEach(function (item) {
            item.x = ~~Utils.Coord.linearActual2Display(item[timeIndex], paneCoords[index].x);
          });
        });
      } else {
        paneData.forEach(function (pane, index) {
          pane.forEach(function (item, ind) {
            item.x = ~~Utils.Coord.linearActual2Display(ind, {
              display: paneCoords[index].x.display,
              actual: [0, pane.length - 1]
            });
          });
        });
      }

      this._panes = paneCoords.map(function (paneCoord, index) {
        return {
          paneCoord: paneCoord,
          paneData: paneData[index]
        };
      });
      this._filteredData = {
        data: paneData.flat()
      };
    }
  }, {
    key: "filterData",
    value: function filterData() {
      var _this$_chart2 = this._chart,
          viewport = _this$_chart2.viewport,
          style = _this$_chart2.style; // const { data } = this._dataSource

      this._filteredData = Utils.Coord.dataFilterByViewport(this._dataSource, viewport, style);
    }
  }, {
    key: "genCoord",
    value: function genCoord() {
      // for data with no timeRanges,
      // use offset & width of data to calc data
      var _this$_chart3 = this._chart,
          viewport = _this$_chart3.viewport,
          style = _this$_chart3.style;
      var _this$_seriesInfo2 = this._seriesInfo,
          series = _this$_seriesInfo2.series,
          timeIndex = _this$_seriesInfo2.timeIndex,
          baseValue = _this$_seriesInfo2.baseValue,
          touchTop = _this$_seriesInfo2.touchTop; // calculate actual-x-range of data

      var xActual = [this._filteredData.data[0][timeIndex], this._filteredData.data[this._filteredData.data.length - 1][timeIndex]]; // calculate actual range of data

      var yRange = Utils.Coord.calcYRange(this._filteredData.data, series); // yRange的初步处理，有baseValue时对称处理，最大最小值相等时增加差异

      var yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, viewport, baseValue); // create coord

      this._coord = {
        x: {
          display: [style.padding.left, viewport.right],
          actual: xActual
        },
        y: {
          display: [viewport.bottom, style.padding.top],
          actual: yActual
        },
        viewport: viewport
      };
      this.genHorizLines();
      this.genVerticalLines();
    }
  }, {
    key: "genHorizLines",
    value: function genHorizLines() {
      var _this = this;

      var style = this._chart.style;
      var _this$_seriesInfo3 = this._seriesInfo,
          baseValue = _this$_seriesInfo3.baseValue,
          touchTop = _this$_seriesInfo3.touchTop;
      var yActual = this._coord.y.actual;
      var horizCount = Utils.Grid.lineCount(this._coord.y.display, style.grid.limit.y, style.grid.span.y);
      var hGridLines = Utils.Grid.calcGridLines(this._coord.y.actual, horizCount, baseValue);

      if (!touchTop) {
        this._coord.y.actual = [hGridLines[0], hGridLines[hGridLines.length - 1]];
      }

      var horizLines = hGridLines.map(function (val) {
        return {
          actual: val,
          display: ~~Utils.Coord.linearActual2Display(val, _this._coord.y)
        };
      });
      this._coord.horizLines = horizLines;
    }
  }, {
    key: "genVerticalLines",
    value: function genVerticalLines() {
      var _this$_chart4 = this._chart,
          style = _this$_chart4.style,
          viewport = _this$_chart4.viewport;
      var timeIndex = this._seriesInfo.timeIndex;
      var verticalLines = [];

      if (this._chartType === 'unscalable') {
        this._panes.forEach(function (pane) {
          // each pane starting line
          verticalLines.push({
            display: pane.paneCoord.x.display[0],
            actual: pane.paneCoord.x.actual[0]
          });

          if (style.grid.unscalaTimeGap) {
            var extraLineX = pane.paneCoord.x.actual[0] + style.grid.unscalaTimeGap;

            while (extraLineX < pane.paneCoord.x.actual[1]) {
              verticalLines.push({
                actual: extraLineX,
                display: ~~Utils.Coord.linearActual2Display(extraLineX, pane.paneCoord.x)
              });
              extraLineX += style.grid.unscalaTimeGap;
            }
          }
        });

        verticalLines.push({
          display: this._panes[this._panes.length - 1].paneCoord.x.display[1],
          actual: this._panes[this._panes.length - 1].paneCoord.x.actual[1]
        });
      } else {
        // vertical grid line drawing for candlestick chart
        for (var l = this._filteredData.data.length - 1; l >= 0; l -= Math.round(style.grid.span.x / viewport.barWidth)) {
          if (this._filteredData.data[l].x > viewport.left && this._filteredData.data[l].x <= viewport.right) verticalLines.push({
            display: ~~this._filteredData.data[l].x,
            actual: this._filteredData.data[l][timeIndex]
          });
        }
      }

      this._coord.verticalLines = verticalLines;
    }
  }, {
    key: "panes",
    get: function get() {
      return this._panes;
    }
  }, {
    key: "filteredData",
    get: function get() {
      return this._filteredData;
    }
  }, {
    key: "coord",
    get: function get() {
      return this._coord;
    }
  }]);

  return DataProvider;
}();

var hammer = createCommonjsModule(function (module) {
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined$1) {

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined$1) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined$1 || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined$1 && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined$1)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined$1 : undefined$1, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined$1) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined$1;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined$1;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined$1)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined$1;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined$1) {
            return;
        }
        if (handler === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined$1) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof undefined$1 === 'function' && undefined$1.amd) {
    undefined$1(function() {
        return Hammer;
    });
} else if (module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');
});

var EventHandler =
/*#__PURE__*/
function () {
  function EventHandler(target, events) {
    var preventDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, EventHandler);

    this._target = target;
    this._events = events;
    this._preventDefault = preventDefault;
    this._hammer = new hammer(target);

    this._init();
  }

  _createClass(EventHandler, [{
    key: "_init",
    value: function _init() {
      this._hammer.get('pinch').set({
        enable: true
      });

      this._hammer.on('pinchstart', this.makeEventHander('pinchStartEvent', true), {
        passive: false
      });

      this._hammer.on('pinchmove', this.makeEventHander('pinchMoveEvent', true), {
        passive: false
      });

      this._hammer.on('pinchend', this.makeEventHander('pinchEndEvent', true), {
        passive: false
      });

      this._hammer.on('panstart', this.makeEventHander('panStartEvent', true));

      this._hammer.on('panmove', this.makeEventHander('panMoveEvent', true));

      this._hammer.on('panend', this.makeEventHander('panEndEvent', true));

      this._target.addEventListener('mousemove', this.makeEventHander('mouseMoveEvent'));

      this._target.addEventListener('mouseleave', this.makeEventHander('mouseLeaveEvent'));

      this._target.addEventListener('wheel', this.makeEventHander('mouseWheelEvent'), {
        passive: false
      });
    }
  }, {
    key: "makeEventHander",
    value: function makeEventHander(eventName) {
      var isHammer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return function (e) {
        if (event.cancelable) {
          event.preventDefault();
        }

        var compatEvent = isHammer ? e : this._makeCompatEvent(e);

        this._processEvent(compatEvent, this._events[eventName]);

        this._preventDefaultIfNeeded(e);
      }.bind(this);
    }
  }, {
    key: "_preventDefaultIfNeeded",
    value: function _preventDefaultIfNeeded(event) {
      if (this._preventDefault && event.cancelable) {
        event.preventDefault();
      }
    }
  }, {
    key: "_makeCompatEvent",
    value: function _makeCompatEvent(event) {
      var eventLike;

      if ('touches' in event && event.touches.length) {
        eventLike = event.touches[0];
      } else if ('changedTouches' in event && event.changedTouches.length) {
        eventLike = event.changedTouches[0];
      } else {
        eventLike = event;
      }

      var deltaX = event.deltaX / 100;
      var deltaY = -(event.deltaY / 100);

      switch (event.deltaMode) {
        case event.DOM_DELTA_PAGE:
          // one screen at time scroll mode
          eventLike.deltaX = deltaX * 120;
          eventLike.deltaY *= deltaY * 120;
          break;

        case event.DOM_DELTA_LINE:
          // one line at time scroll mode
          eventLiked.deltaX = deltaX * 32;
          eventLike.deltaY = deltaY * 32;
          break;
      }

      var box = this._target.getBoundingClientRect() || {
        left: 0,
        top: 0
      };
      return {
        clientX: eventLike.clientX,
        clientY: eventLike.clientY,
        pageX: eventLike.pageX,
        pageY: eventLike.pageY,
        deltaX: eventLike.deltaX || null,
        deltaY: eventLike.deltaY || null,
        screenX: eventLike.screenX,
        screenY: eventLike.screenY,
        localX: eventLike.clientX - box.left,
        localY: eventLike.clientY - box.top,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        target: eventLike.target,
        view: event.view,
        preventDefault: function preventDefault() {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      };
    }
  }, {
    key: "_processEvent",
    value: function _processEvent(event, eventFunc) {
      if (!eventFunc) {
        return;
      }

      eventFunc.call(this._events, event);
    }
  }]);

  return EventHandler;
}();

var _dash, _properties, _title$title$type$req;

var labelProperty = {
  show: {
    title: 'whether show the label',
    type: 'boolean'
  },
  color: {
    title: 'label font color',
    type: 'string'
  },
  fontSize: {
    title: 'label font size',
    type: 'number'
  },
  textAlign: {
    title: 'label text align',
    description: 'mdn: CanvasRenderingContext2D.textAlign',
    type: 'string'
  },
  textBaseline: {
    title: 'label textBaseline',
    description: 'mdn: CanvasRenderingContext2D.textBaseline',
    type: 'string'
  },
  offset: {
    title: 'position offset for adjust title',
    type: 'object',
    properties: {
      x: {
        title: 'horizone offset',
        type: 'number'
      },
      y: {
        title: 'vertical offset',
        type: 'number'
      }
    }
  }
};
var updownColorProperty = {
  up: {
    title: 'up color',
    type: 'string'
  },
  down: {
    title: 'down color',
    type: 'string'
  }
};
var schema = (_title$title$type$req = {
  title: 'chart-config'
}, _defineProperty(_title$title$type$req, "title", 'lavania config'), _defineProperty(_title$title$type$req, "type", 'object'), _defineProperty(_title$title$type$req, "required", ['type']), _defineProperty(_title$title$type$req, "properties", {
  type: {
    title: 'chart type, use "scalable" to specify a chart that can be zoomed or paned, if scalable is defined, series.timeRanges will be ignored. use "unscalable" to specify a chart can not change viewport',
    "enum": ['scalable', 'unscalable']
  },
  noEvents: {
    title: 'whether forbid events',
    type: 'boolean'
  },
  viewport: {
    title: 'when chart.type is scalable, viewport will used to describe the data viewport',
    properties: {
      barWidth: {
        title: 'width of each data column',
        minimum: 4,
        maximum: 64,
        type: 'number'
      },
      offset: {
        title: 'x-offset of the chart, change this value will make the initial viewport move left or right',
        type: 'number'
      }
    }
  },
  valuePrecision: {
    title: 'price precision for chart label',
    type: 'number'
  },
  valueFormatter: {
    description: 'if valuePrecision is not good enough for need, you can use valueFormatter provide a function to gennerate the priceText from value'
  },
  dateFormat: {
    title: 'dateFormatter to format date, can be datePattern(like "YYYY-MM-DD HH:mm:ss") or a function',
    type: 'string'
  },
  font: {
    title: 'chart font config',
    type: 'object',
    properties: {
      family: {
        title: 'font family',
        type: 'string'
      },
      size: {
        title: 'font size',
        type: 'number'
      }
    }
  },
  padding: {
    title: 'chart padding to canvas container',
    type: 'object',
    properties: {
      left: {
        title: 'left padding of the canvas container',
        type: 'number'
      },
      right: {
        title: 'right padding of the canvas container',
        type: 'number'
      },
      top: {
        title: 'top padding of the canvas container',
        type: 'number'
      },
      bottom: {
        title: 'bottom padding of the canvas container',
        type: 'number'
      }
    }
  },
  zoomSpeed: {
    title: 'speed for zoom chart when triggled by mouseWheel Event',
    type: 'number'
  },
  valueRangeBoundary: {
    title: 'line indicator for highest & lowest value in viewport',
    type: 'object',
    properties: {
      show: {
        title: 'whether show the lines ',
        type: 'boolean'
      },
      dash: {
        title: 'line dash',
        description: 'refer to mdn: CanvasRenderingContext2D.setLineDash',
        type: 'array'
      },
      lineWidth: {
        title: 'boundary line width',
        type: 'number'
      },
      highColor: {
        title: 'line color indicate the highest value in viewport',
        description: 'refer to mdn: CanvasRenderingContext2D.lineWidth',
        type: 'string'
      },
      lowColor: {
        title: 'line color indicate the lowest value in viewport',
        description: 'refer to mdn: CanvasRenderingContext2D.lineWidth',
        type: 'string'
      }
    }
  },
  crosshair: {
    title: 'crosshair indicator for mouseMove | touch(in mobile) event',
    type: 'object',
    properties: {
      snapToData: {
        title: 'whether crosshair snap to the value or align with mouse position, when set to ture, crosshair will snap to the mainSeries(set in seriesInfo.mainSeriesIndex, fallback to 0)',
        type: 'boolean'
      },
      // toolTip: {
      //   title: 'callback function to create toolTip ',
      //   type: 'any'
      // },
      snapProperty: {
        title: 'when snapToData is ture, specify a property which crosshair will snapto, if this prop is not defined, will try data[valIndex], if valIndex is not defined, will use data[closeIndex]',
        // type: 'string',
        "enum": ['valIndex', 'openIndex', 'closeIndex', 'highIndex', 'lowIndex']
      },
      color: {
        title: 'crosshair line color',
        type: 'string'
      },
      dash: (_dash = {
        title: 'line dash'
      }, _defineProperty(_dash, "title", 'refer to mdn: CanvasRenderingContext2D.setLineDash'), _defineProperty(_dash, "type", 'array'), _dash),
      lineWidth: {
        title: 'crosshair line width',
        type: 'number'
      },
      axisLabel: {
        title: 'axis label for the snap point',
        type: 'object',
        properties: (_properties = {
          xAxisLabelPos: {
            title: 'corsshair axis label position for x-axis, can be: bottom | top',
            type: 'string'
          }
        }, _defineProperty(_properties, "xAxisLabelPos", {
          title: 'corsshair axis label position for y-axis, can be: top | bottom',
          type: 'string'
        }), _defineProperty(_properties, "fontSize", {
          title: 'corsshair axis label fontsize',
          type: 'number'
        }), _defineProperty(_properties, "height", {
          title: 'corsshair axis label height',
          type: 'number'
        }), _defineProperty(_properties, "bg", {
          title: 'corsshair axis label background color',
          type: 'string'
        }), _defineProperty(_properties, "color", {
          title: 'corsshair axis label font-color',
          type: 'string'
        }), _defineProperty(_properties, "horizPadding", {
          title: 'left & right padding of the corsshair axis label',
          type: 'number'
        }), _defineProperty(_properties, "posOffset", {
          title: 'position offset for the corsshair axis label,which can used for adjust the position',
          type: 'object',
          properties: {
            yAxisLabel: {
              title: 'vertical position offset for the corsshair y-axis label, which can used for adjust the position',
              type: 'object',
              properties: {
                x: {
                  title: 'horizone offset',
                  type: 'number'
                },
                y: {
                  title: 'vertical offset',
                  type: 'number'
                }
              }
            },
            xAxisLabel: {
              title: 'position offset for the corsshair x-axis label, which can used for adjust the position',
              type: 'object',
              properties: {
                x: {
                  title: 'horizone offset',
                  type: 'number'
                },
                y: {
                  title: 'vertical offset',
                  type: 'number'
                }
              }
            }
          }
        }), _properties)
      },
      selectedPoint: {
        title: 'style for selected point, define as several nested circles',
        type: 'object',
        properties: {
          radius: {
            title: 'array to describe radius of each layer',
            type: 'array'
          },
          color: {
            title: 'array to describe color of each layer',
            type: 'array'
          }
        }
      }
    }
  },
  grid: {
    title: 'style for the grid',
    type: 'object',
    properties: {
      bg: {
        title: 'background color for the grid',
        type: 'string'
      },
      showHorizoneLines: {
        title: 'whether show horizone lines',
        type: 'boolean'
      },
      showVerticalLines: {
        title: 'whether show vertical lines',
        type: 'boolean'
      },
      lineColor: {
        title: 'line color for the grid',
        type: 'object',
        properties: {
          x: {
            title: 'color for lines parallel to the x-axis',
            type: 'string'
          },
          y: {
            title: 'color for lines parallel to the y-axis',
            type: 'string'
          }
        },
        unscalaTimeGap: {
          title: 'use for unscalable chart, for vertical lines shows by timegap',
          type: 'number'
        }
      },
      span: {
        title: 'span between lines of grid',
        type: 'object',
        properties: {
          x: {
            title: 'span between lines parallel to the x-axis',
            type: 'number'
          },
          y: {
            title: 'span between lines parallel to the y-axis',
            type: 'number'
          }
        }
      },
      limit: {
        title: 'count limit of grid lines',
        type: 'object',
        properties: {
          y: {
            title: 'count limit of  grid lines parallel to the y-axis',
            type: 'object',
            properties: {
              max: {
                title: 'max limit of  grid lines parallel to the y-axis',
                type: 'number'
              },
              min: {
                title: 'min limit of  grid lines parallel to the y-axis',
                type: 'number'
              }
            }
          }
        }
      }
    }
  },
  axis: {
    title: 'axis style for chart',
    type: 'object',
    properties: {
      showBorder: {
        title: 'whether show axis border',
        type: 'boolean'
      },
      borderColor: {
        title: 'color of axis border',
        type: 'string'
      },
      bgColor: {
        title: 'axis background color',
        type: 'string'
      },
      label: {
        title: 'axis background color',
        type: 'object',
        properties: {
          left: {
            title: 'label on the left side of the chart',
            type: 'object',
            properties: labelProperty
          },
          top: {
            title: 'label on the top side of the chart',
            type: 'object',
            properties: labelProperty
          },
          right: {
            title: 'label on the right side of the chart',
            type: 'object',
            properties: labelProperty
          },
          bottom: {
            title: 'label on the bottom side of the chart',
            type: 'object',
            properties: labelProperty
          }
        }
      }
    }
  },
  seriesStyle: {
    title: 'default style config for series',
    type: 'object',
    properties: {
      baseValue: {
        title: 'base value line color, base-value line will show when a series  been set baseValue',
        type: 'string'
      },
      baseValueLine: {
        title: 'base value line config',
        type: 'object',
        properties: {
          dash: {
            title: 'line dash',
            description: 'refer to mdn: CanvasRenderingContext2D.setLineDash',
            type: 'array'
          },
          lineWidth: {
            title: 'line width',
            type: 'number'
          },
          color: {
            title: 'line color',
            type: 'string'
          }
        }
      },
      candlestick: {
        title: 'color style for candlestick chart',
        type: 'object',
        properties: {
          block: {
            title: 'candlestock block color',
            properties: updownColorProperty
          },
          border: {
            title: 'candlestock border color',
            properties: updownColorProperty
          },
          wick: {
            title: 'candlestock wick color',
            properties: updownColorProperty
          }
        }
      },
      OHLC: {
        title: 'color style for OHLC chart',
        type: 'object',
        properties: updownColorProperty
      },
      mountain: {
        title: 'color style for mountain-like chart',
        type: 'object',
        properties: {
          lineWidth: {
            title: 'mountain-like chart lineWidth',
            type: 'number'
          },
          lineColor: {
            title: 'mountain-like chart lineColor',
            type: 'string'
          },
          gradientUp: {
            title: 'first stop color for linear mountain body',
            type: 'string'
          },
          gradientDown: {
            title: 'last stop color for linear mountain body',
            type: 'string'
          }
        }
      },
      column: {
        title: 'color style for column chart',
        type: 'object',
        properties: {
          block: {
            title: 'column block color',
            properties: updownColorProperty
          },
          border: {
            title: 'column border color',
            properties: updownColorProperty
          }
        }
      }
    }
  },
  seriesInfo: {
    title: 'chart series config relate to data, specify which data will use to render the chart',
    type: 'object',
    properties: {
      timeIndex: {
        title: 'specify the index of time in the data, multi series will share the timeIndex',
        type: 'number'
      },
      xByIndex: {
        title: 'x-axis increase by index insdead of time',
        type: 'boolean'
      },
      mainSeriesIndex: {
        title: 'specify the index of the main series, main series is used for crosshair to snap to, default to 0',
        type: 'number'
      },
      series: {
        title: 'series config',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            seriesType: {
              title: 'chart type, can be "line | mountain | candlestick | OHLC"',
              type: 'string',
              "enum": ['line', 'mountain', 'candlestick', 'OHLC']
            },
            openIndex: {
              type: 'number'
            },
            closeIndex: {
              type: 'number'
            },
            highIndex: {
              type: 'number'
            },
            lowIndex: {
              type: 'number'
            },
            valIndex: {
              type: 'number'
            },
            style: {
              type: 'object'
            }
          }
        }
      }
    }
  }
}), _title$title$type$req);

var genContext = Symbol();
var genCanvasLayer = Symbol();
var painter = Symbol();

var Chart =
/*#__PURE__*/
function () {
  function Chart(container, dataSource, options) {
    _classCallCheck(this, Chart);

    // prevent same data for different charts
    this.dataSource = JSON.parse(JSON.stringify(dataSource)); // Utils.Safe.dataCheck(dataSource)
    //  = dataSource

    var _this$genCanvasLayer = this[genCanvasLayer](container),
        canvasEl = _this$genCanvasLayer.canvasEl,
        iaCanvasEl = _this$genCanvasLayer.iaCanvasEl;

    this.genToolTipLayer(container);
    this.originWidth = canvasEl.width;
    this.originHeight = canvasEl.height;
    this.ctx = this[genContext](canvasEl);
    this.iaCtx = this[genContext](iaCanvasEl);
    this.linkedCharts = new Set();
    var defaults = DEFAULTS();
    this.style = merge_1(defaults, options);
    this.schema = schema;
    this.seriesInfo = options.seriesInfo;
    this.confirmType();
    this.genStyle();
    this.dataProvider = new DataProvider(this.dataSource, this.type, this);
    this.render = new Render(this);

    if (!this.rerender) {
      this.rerender = throttle(this[painter], 16);
    }

    this.rerender();

    if (!this.style.noEvents) {
      this.events = genEvent(this, this.type);
      this.EventHandler = new EventHandler(container, this.events);
    } // this.events = genEvent(this, this.type)
    // this.EventHandler = new EventHandler(container, this.events)

  }

  _createClass(Chart, [{
    key: "updateOption",
    value: function updateOption(newOpt) {
      this.style = merge_1(this.style, newOpt);

      if (newOpt.seriesInfo) {
        this.seriesInfo = merge_1(this.seriesInfo, newOpt.seriesInfo);
      }

      this.confirmType();
      this.genStyle(); // this.dataProvider && this.dataProvider.produce()

      this.dataProvider = new DataProvider(this.dataSource, this.type, this);
      this.rerender();
    }
  }, {
    key: genCanvasLayer,
    value: function value(container) {
      var canvasMain = document.createElement('canvas');
      var canvasIa = document.createElement('canvas');
      canvasMain.width = canvasIa.width = container.clientWidth;
      canvasMain.height = canvasIa.height = container.clientHeight;
      canvasMain.style.position = canvasIa.style.position = 'absolute';
      canvasMain.style.top = canvasIa.style.top = 0;
      canvasMain.style.left = canvasIa.style.left = 0;
      if (!container.style.position || container.style.position === 'static') container.style.viewport = 'relative';
      container.innerHTML = '';
      container.appendChild(canvasMain);
      container.appendChild(canvasIa);
      return {
        canvasEl: canvasMain,
        iaCanvasEl: canvasIa
      };
    }
  }, {
    key: genContext,
    value: function value(canvasEl) {
      var dpr = window ? window.devicePixelRatio : 1;
      var ctx = canvasEl.getContext('2d');
      canvasEl.style.width = (canvasEl.clientWidth || canvasEl.width) + 'px';
      canvasEl.style.height = (canvasEl.clientHeight || canvasEl.height) + 'px';
      canvasEl.width *= dpr;
      canvasEl.height *= dpr;
      ctx.scale(dpr, dpr);
      return ctx;
    }
  }, {
    key: "genStyle",
    value: function genStyle() {
      this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
      this.iaCtx.font = this.ctx.font;
      this.viewport = Object.assign({}, this.style.viewport, {
        left: this.style.padding.left,
        top: this.style.padding.top,
        right: this.originWidth - this.style.padding.right,
        bottom: this.originHeight - this.style.padding.bottom
      });
    }
  }, {
    key: painter,
    value: function value(linked, force) {
      var _this = this;

      this.dataProvider && this.dataProvider.produce();
      this.clean();
      Utils.Draw.Fill(this.ctx, function (ctx) {
        ctx.rect(0, 0, _this.originWidth, _this.originHeight);
      }, this.style.grid.bg);
      this.render.rend(); // rerender all linked charts

      if (this.linkedCharts.size && !linked) {
        _toConsumableArray(this.linkedCharts).forEach(function (chart) {
          chart.viewport.offset = _this.viewport.offset;
          chart.viewport.barWidth = _this.viewport.barWidth;
          chart.rerender(true);
        });
      }
    }
  }, {
    key: "genToolTipLayer",
    value: function genToolTipLayer(container) {
      container.style.position = 'relative';
      var toolTipLayer = document.createElement('div');
      toolTipLayer.style.position = 'absolute';
      toolTipLayer.style.left = 0;
      toolTipLayer.style.right = 0;
      toolTipLayer.style.top = 0;
      toolTipLayer.style.bottom = 0;
      toolTipLayer.style.background = 'transparent';
      container.appendChild(toolTipLayer);
      this.toolTipLayer = toolTipLayer;
    }
  }, {
    key: "reInit",
    value: function reInit(container) {
      var _this$genCanvasLayer2 = this[genCanvasLayer](container),
          canvasEl = _this$genCanvasLayer2.canvasEl,
          iaCanvasEl = _this$genCanvasLayer2.iaCanvasEl;

      this.genToolTipLayer(container);
      this.originWidth = canvasEl.width;
      this.originHeight = canvasEl.height;
      this.ctx = this[genContext](canvasEl);
      this.iaCtx = this[genContext](iaCanvasEl);
      this.confirmType();
      this.genStyle(); // this.dataProvider && this.dataProvider.produce()

      this.dataProvider = new DataProvider(this.dataSource, this.type, this);
      this.rerender();
    }
  }, {
    key: "confirmType",
    value: function confirmType() {
      this.type = this.style.type; // if((this.seriesInfo.timeRanges && this.seriesInfo.timeRanges.length > 1 ) && this.style.type === 'scalable') {
      //   this.type = 'unscalable'
      //   throw 'multi timeRanges chart cannot be scalable'
      // }
    }
  }, {
    key: "clean",
    value: function clean(e, name, force) {
      this.iaCtx.clearRect(0, 0, this.originWidth, this.originHeight); // rerender all linked charts

      if (this.linkedCharts.size && !force) {
        this.linkedCharts.forEach(function (chart) {
          chart.events.mouseLeaveEvent.call(chart, null, true);
        });
      }
    }
  }]);

  return Chart;
}();

function linkCharts() {
  for (var _len = arguments.length, charts = new Array(_len), _key = 0; _key < _len; _key++) {
    charts[_key] = arguments[_key];
  }

  charts.forEach(function (chart) {
    charts.forEach(function (otherChart) {
      if (chart !== otherChart) chart.linkedCharts && chart.linkedCharts.add(otherChart);
    });
  });
}

export { Chart, linkCharts };
