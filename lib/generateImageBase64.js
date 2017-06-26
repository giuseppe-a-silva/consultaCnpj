const buildPromise = require('./buildPromise');

// Gera a imagem no formato Base64.
// Informar, como parâmetro, o buffer da imagem.
function generateImageBase64(buffer) {
  let magic = [
    'ffd8ffe0',
    '89504e47',
    '47494638',
  ];
  magic = new RegExp(magic.join('|'));
  const hexBody = buffer.toString('hex', 0, 4);
  if (!magic.test(hexBody)) {
    return buildPromise(new Error('Impossível gerar a imagem!'));
  }

  return new Buffer(buffer).toString('base64');
}

module.exports = generateImageBase64;
