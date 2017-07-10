const buildPromise = require('./buildPromise');
const iconv = require('iconv-lite');

const getBodyAndEncode = response => buildPromise( iconv.decode( new Buffer(response.body), 'ISO-8859-1' ) );

module.exports = getBodyAndEncode;
