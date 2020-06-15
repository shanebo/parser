const qs = require('qs');
const { coerce } = require('coerce');


module.exports = (options) => {
  const defaults = {
    coerce: true,
    allowDots: true,
    arrayFormat: 'repeat'
  };

  const opts = { ...defaults, ...options };

  return (req, res, next) => {
    if (/^(POST|PUT|PATCH|DELETE)$/i.test(req.method)) {
      let body = '';

      req.on('data', (data) => {
        body += data;
      });

      req.on('end', () => {
        if (body) {
          const isJSON = req.is('json');
          const data = isJSON ? JSON.parse(body) : qs.parse(body, opts);
          const params = isJSON ? qs.stringify(data, opts) : body;
          req.body = coerce(data, opts, params);
        }

        next();
      });
    } else {
      next();
    }
  }
}
