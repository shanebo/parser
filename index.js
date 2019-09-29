const qs = require('qs');
const { coerce } = require('./coerce');


module.exports = (options) => {
  const defaults = {
    coerce: true,
    allowDots: true,
    arrayFormat: 'repeat'
  };

  const opts = { ...defaults, ...options };

  // Object.defineProperty(httprequest, 'query', {
  //   get() {
  //     super();
  //     this._query = coerceValues(this._query);
  //     coerceParams(this.search, this._query);
  //     return this._query;
  //   }
  //   set(val) {
  //     super(val);
  //     return this._query;
  //   }
  // })


  return (req, res, next) => {
    // implement object define instead so it only runs when app calls it
    if (req.querystring) {
      req.query = coerce(req.query, opts, req.querystring);
    }

    if (/^(POST|PUT|PATCH|DELETE)$/i.test(req.method)) {
      let body = '';

      req.on('data', (data) => {
        body += data;
      });

      req.on('end', () => {
        if (body) {
          req.body = req.is('json')
            ? JSON.parse(body)
            : qs.parse(body, opts)

          req.body = coerce(req.body, opts, decodeURIComponent(body));
        }

        next();
      });
    } else {
      next();
    }
  }
}
