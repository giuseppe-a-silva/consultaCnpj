import { test } from 'ava';
import getParams from '../lib/getParams';

const base64RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
const binaryImageRegExp = new RegExp(['ffd8ffe0', '89504e47', '47494638'].join('|'));

test(`#getParams()`, async t => {
  const result = await getParams();
  const binaryCaptcha = Buffer.from(result.captcha, 'base64');

  t.true(base64RegExp.test(result.captcha), `is a base64 string`);
  t.true(binaryImageRegExp.test(binaryCaptcha.toString('hex', 0, 4)), `is a image`);
  t.true((result.sessionId).startsWith('ASPSESSIONID'), `is a ASPSESSIONID cookie`);
});

