// Retorna apenas os números contidos na String informada.
function unmaskNumbers(num) {
  let unmasked = num.match(/\d+/g);
  unmasked = unmasked.join('');

  return String(unmasked);
}

module.exports = unmaskNumbers;
