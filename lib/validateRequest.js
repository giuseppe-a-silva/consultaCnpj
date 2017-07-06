const buildPromise = require('./buildPromise');

function validateRequest(response, errorMessage = 'Erro! Por favor, tente novamente!') {
  if (response.statusCode !== 200) {
    return buildPromise(new Error(errorMessage));
  }

  return buildPromise(response);
}

module.exports = validateRequest;
