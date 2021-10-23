const qs = require('qs');

module.exports = () => {
  return (req, res, next) => {
    if (/^(POST|PUT|PATCH|DELETE)$/i.test(req.method)) {
      let body = '';
      req.on('data', (data) => {
        body += data;
      });

      req.on('end', () => {
        req.body = req.is('json')
          ? JSON.parse(body)
          : qs.parse(body);
        next();
      });
    } else {
      next();
    }
  }
}
