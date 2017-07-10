const buildPromise = require('./buildPromise');

const validateRequest = (response, errorMessage = 'Erro! Por favor, tente novamente!') =>
  (response.statusCode !== 200)
  ? buildPromise(new Error(errorMessage))
  : buildPromise(response);

module.exports = validateRequest;
