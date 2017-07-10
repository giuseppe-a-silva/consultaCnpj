const buildPromise = require('./buildPromise');

const generateImageBase64 = (buffer) => {
  const magic = new RegExp(['ffd8ffe0', '89504e47', '47494638'].join('|'));
  const hexBody = buffer.toString('hex', 0, 4);

  return (!magic.test(hexBody)) ? buildPromise( new Error('Impossível gerar a imagem!') ) : new Buffer(buffer).toString('base64');
}

module.exports = generateImageBase64;
