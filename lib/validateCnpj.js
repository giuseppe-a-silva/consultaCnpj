const unmasker = require('./unmaskNumbers');

// Valida o CNPJ informado, conforme parâmetros da RFB.
function validateCnpj(cnpj) {
  const numCnpj = unmasker(cnpj);

  if (numCnpj.length !== 14) {
    return false;
  }

  if (numCnpj === '00000000000000' ||
     numCnpj === '11111111111111' ||
     numCnpj === '22222222222222' ||
     numCnpj === '33333333333333' ||
     numCnpj === '44444444444444' ||
     numCnpj === '55555555555555' ||
     numCnpj === '66666666666666' ||
     numCnpj === '77777777777777' ||
     numCnpj === '88888888888888' ||
     numCnpj === '99999999999999') {
    return false;
  }

  let s = (numCnpj.length - 2);
  const DV = numCnpj.substr(s);
  let b = numCnpj.substr(0, s);
  let t = 0;
  let p = s - 7;

  for (let i = s; i >= 1; i -= 1) {
    t += (b.charAt(s - i) * p);
    p -= 1;
    p = (p < 2 ? 9 : p);
  }

  let r = ((t % 11) < 2 ? 0 : 11 - (t % 11));

  if (String(r) !== DV.charAt(0)) {
    return false;
  }

  s += 1;
  b = numCnpj.substr(0, s);
  t = 0;
  p = s - 7;

  for (let i = s; i >= 1; i -= 1) {
    t += (b.charAt(s - i) * p);
    p -= 1;
    p = (p < 2 ? 9 : p);
  }

  r = ((t % 11) < 2 ? 0 : 11 - (t % 11));

  if (String(r) !== DV.charAt(1)) {
    return false;
  }

  return true;
}

module.exports = validateCnpj;
