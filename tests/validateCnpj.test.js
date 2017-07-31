import { test } from 'ava';
import validateCnpj from '../lib/validateCnpj';

const fakeCnpj = {
  sameDigits: '11111111111111',
  invalid: '47959532000115',
  valid: {
    masked: '47.959.532/0001-14',
    unmasked: '47959532000114',
  },
};

test(`#validateCnpj(${ fakeCnpj.sameDigits })`, t => {
  t.false(validateCnpj(fakeCnpj.sameDigits), `it's false`);
});

test(`#validateCnpj(${ fakeCnpj.invalid })`, t => {
  t.false(validateCnpj(fakeCnpj.invalid), `it's false`);
});

test(`#validateCnpj(${ fakeCnpj.valid.masked })`, t => {
  t.true(validateCnpj(fakeCnpj.valid.masked), `it's true`);
});

test(`#validateCnpj(${ fakeCnpj.valid.unmasked })`, t => {
  t.true(validateCnpj(fakeCnpj.valid.unmasked), `it's true`);
});
