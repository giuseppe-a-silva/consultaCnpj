const promiseHandler = require('./promiseHandler');

const validateRequest = (r, m = 'Erro! Por favor, tente novamente!') =>
  ((r.statusCode !== 200)
    ? promiseHandler(new Error(m))
    : promiseHandler(r));

module.exports = validateRequest;
