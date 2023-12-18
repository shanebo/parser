const qs = require('qs');
const { coerce } = require('@dylan/coerce');
const WRITE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];


module.exports = (options) => {
  const opts = {
    coerce: true,
    allowDots: true,
    arrayFormat: 'repeat',
    ...options
  };

  return (req, res, next) => {
    if (WRITE_METHODS.includes(req.method)) {
      const isSupportedContentType = req.is(['json', 'urlencoded']);

      if (isSupportedContentType) {
        let body = '';

        req.on('data', (data) => {
          body += data;
        });

        req.on('end', () => {
          if (body) {
            try {
              const isJson = isSupportedContentType === 'json';
              const data = isJson ? JSON.parse(body) : qs.parse(body, opts);
              const params = isJson ? qs.stringify(data, opts) : body;
              req.body = coerce(data, opts, params);
            } catch (err) {
              err.message = 'Bad Request';
              return res.error(err);
            }
          }

          // needed because higher level try/catch
          // that wraps the entire request handler
          // won't catch errors in async functions
          try {
            next();
          } catch (err) {
            res.error(err);
          }
        });
      } else {
        res.error(new Error('Unsupported Media Type'));
      }
    } else {
      next();
    }
  }
}
