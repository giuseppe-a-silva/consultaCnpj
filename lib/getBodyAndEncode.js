const buildPromise = require('./buildPromise');
const iconv = require('iconv-lite');

// Transforma as informações passadas em ISO-8859-1;
function getBodyAndEncode(response) {
  const encoded = iconv.decode(new Buffer(response.body), 'ISO-8859-1');

  return buildPromise(encoded);
}

module.exports = getBodyAndEncode;
