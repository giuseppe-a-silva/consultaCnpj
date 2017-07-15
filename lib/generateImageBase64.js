const buildPromise = require('./buildPromise');

const generateMagicRegExp = () => new RegExp(['ffd8ffe0', '89504e47', '47494638'].join('|'));

const generateImageBase64 = (buffer) => ((!generateMagicRegExp().test(buffer.toString('hex', 0, 4))) ? buildPromise( new Error('Impossível gerar a imagem!') ) : new Buffer(buffer).toString('base64'));

module.exports = generateImageBase64;
