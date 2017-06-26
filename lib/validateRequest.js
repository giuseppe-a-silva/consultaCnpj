const buildPromise = require('./buildPromise');

// Confere se há algum código de erro em response.statusCode.
function validateRequest(response, errorMessage = 'Erro! Por favor, tente novamente!') {
  if (response.statusCode !== 200) {
    return buildPromise(new Error(errorMessage));
  }

  return buildPromise(response);
}

module.exports = validateRequest;
