import { test } from 'ava';
import unmaskNumbers from '../lib/unmaskNumbers';

const fakeNumbers = [
  '.2548-52214/',
  '222658/554#433',
  '2245569-',
  '1212123',
  '1.asdds;2334ddas',
];

fakeNumbers.forEach(n => {
  test(`#unmasknumbers(${ n })`, t => {
    t.true(/\d+/g.test(n), `has only numbers`);
  });
});
