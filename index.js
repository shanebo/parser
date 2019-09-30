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
