import { test } from 'ava';
import request from 'request-promise-native';
import generateImageBase64 from '../lib/generateImageBase64';

const defaultError = {
  code: 3,
  message: 'Impossível gerar a imagem!',
  status: 500,
};
const base64RegExp = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
const getImage = () =>
  request({
    encoding: null,
    url: 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/captcha/gerarCaptcha.asp',
    method: 'GET',
    resolveWithFullResponse: true,
    headers: {
      Host: 'www.receita.fazenda.gov.br',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Referer: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/cnpjreva_solicitacao2.asp',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
    },
  });

const notAnImage = "It isn't an image!";

test(`#generateImageBase64('${ notAnImage }')`, async t => {
  const error = await t.throws(generateImageBase64(notAnImage));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to 1`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#generateImageBase64(#image)`, async t => {
  const data = await getImage();
  const anImage = data.body;
  const result = await generateImageBase64(anImage);

  t.true(base64RegExp.test(result), `is a base64 string`);
  t.false(result instanceof Error, `in not a instance of error`);
});
