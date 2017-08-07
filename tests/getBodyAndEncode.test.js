import { test } from 'ava';
import getBodyAndEncode from '../lib/getBodyAndEncode';

const iso88591String = 'aâãÃÂéíóú<>-_.bç';
const nonIso88591String = 'の は でした';

test(`#getBodyAndEncode('{ body: ${ iso88591String } }')`, async t => {
  const result = await getBodyAndEncode({ body: iso88591String });

  t.false(/[^\u0000-\u00ff]/g.test(result), `hasn't any non ISO-8859-1 character`);
});

test(`#getBodyAndEncode('{ body: ${ nonIso88591String } }')`, async t => {
  const result = await getBodyAndEncode({ body: nonIso88591String });

  t.false(/[^\u0000-\u00ff]/g.test(result), `hasn't any non ISO-8859-1 character`);
});
