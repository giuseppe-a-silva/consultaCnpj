const promiseHandler = require('./promiseHandler');

const validateRequest = (r, m = 'Falha na requisição! Por favor, tente novamente!') =>
  ((r.statusCode !== 200)
    ? promiseHandler({ type: 'error', code: 1, message: m, status: r.statusCode })
    : promiseHandler(r));

module.exports = validateRequest;
