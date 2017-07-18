const buildPromise = require('./buildPromise');

const validateRequest = (r, m = 'Erro! Por favor, tente novamente!') =>
  ((r.statusCode !== 200)
    ? buildPromise(new Error(m))
    : buildPromise(r));

module.exports = validateRequest;
