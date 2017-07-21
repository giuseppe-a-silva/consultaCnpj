const promiseHandler = require('./promiseHandler');
const iconv = require('iconv-lite');

const getBodyAndEncode = response =>
  promiseHandler(iconv.decode(new Buffer(response.body), 'ISO-8859-1'));

module.exports = getBodyAndEncode;
