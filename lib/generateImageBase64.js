const buildPromise = require('./buildPromise');

const generateMagicRegExp = () =>
  new RegExp(['ffd8ffe0', '89504e47', '47494638'].join('|'));

const generateImageBase64 = b =>
  ((!generateMagicRegExp().test(b.toString('hex', 0, 4)))
    ? buildPromise( new Error('Impossível gerar a imagem!') )
    : new Buffer(b).toString('base64'));

module.exports = generateImageBase64;
