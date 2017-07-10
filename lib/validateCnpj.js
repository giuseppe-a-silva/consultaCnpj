const unmasker = require( './unmaskNumbers' );

const getDigit = t => (t >= 2) ? 11 - t : 0;
const getData = (numCnpj, s) => [numCnpj.substr(0, s), 0, s - 7];
const digitIsValid = (d1, d2) => (String(d1) === d2);

const isSameDigits = array => array.split('').every( (elem) => elem === array[0] );

const getSomeData = (t, b, s, p, i) => [t + (b.charAt(s - i) * p), --p, (p < 2 ? 9 : p)];

const validDigit = (numCnpj, second = false) => {
  let s = (numCnpj.length - 2);
  let id = 0;

  const DV = numCnpj.substr(s);

  if (second) {
    ++s;
    ++id;
  }

  let [b, t, p] = getData(numCnpj, s);

  for (let i = s; i >= 1; i--) {
    [t, _, p] = getSomeData(t, b, s, p, i);
  }

  return digitIsValid(getDigit(t % 11), DV[id]);
}

const validate = numCnpj => !( numCnpj.length !== 14 || isSameDigits(numCnpj) ) ? ( validDigit(numCnpj) && validDigit(numCnpj, true) ) : false;

const validateCnpj = cnpj => validate(unmasker(cnpj));

module.exports = validateCnpj;
