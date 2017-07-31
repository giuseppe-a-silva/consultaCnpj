import { test } from 'ava';
import { jar } from 'request';
import makeJar from '../lib/makeJar';

const url = 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva';
const arg = 'sessionId=1';
const result = `${ arg }; flag=1`;

test(`#makeJar('${ url }/valida.asp', 'sessionId=1')`, t => {
  const jar = makeJar(`${ url }/valida.asp`, arg);

  const data = jar.getCookieString(url);

  t.is(data, result);
});
