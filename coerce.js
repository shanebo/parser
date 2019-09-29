const dotProp = require('dot-prop');
const querystring = require('querystring');

const keywords = {
  true: true,
  false: false,
  null: null,
  undefined,
};

const isPlainObject = (val) => Object.prototype.toString.call(val) === '[object Object]';
const coerceArray = (arr) => arr.map(coerceValue);
const coerceObject = (obj) => Object.entries(obj)
  .reduce((nobj, [key, val]) => {
    nobj[key] = coerceValue(val);
    return nobj;
  }, {});

const coerceValue = (val) => {
  if (/^(\d+|\d*\.\d+)$/.test(val)) {
    return parseFloat(val);

  } else if (val === '') {
    return val;

  } else if (val in keywords) {
    return keywords[val]

  } else if (Array.isArray(val)) {
    return coerceArray(val);

  } else if (isPlainObject(val)) {
    return coerceObject(val);
  }

  return val;
}

const coerceParams = (obj, q, map) => {
  Object.keys(querystring.parse(q)).forEach(param => {
    const format = map[param];
    if (format) {
      dotProp.set(obj, param, format(dotProp.get(obj, param)));
    }
  });
  return obj;
}

const coerce = (obj, opts, q) => {
  const nobj = coerceValue(obj);
  return (opts && opts.coerceMap) && q
    ? coerceParams(nobj, q, opts.coerceMap)
    : nobj;
}

exports.coerce = coerce;
