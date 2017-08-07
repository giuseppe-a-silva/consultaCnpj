const promiseHandler = require('./promiseHandler');
const iconv = require('iconv-lite');

const getBodyAndEncode = r =>
  promiseHandler(iconv.decode(new Buffer(r.body), 'ISO-8859-1'));

module.exports = getBodyAndEncode;
