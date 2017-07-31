import { test } from 'ava';
import promiseHandler from '../lib/promiseHandler';

const defaultError = {
  code: 2,
  message: 'Erro interno!',
  status: 500,
};
const fatalError = {
  code: 3,
  message: 'Falha geral!',
  status: 501,
};
const notAnError = {
  foo: 'bar'
};

test(`#promiseHandler()`, async t => {
  const error = await t.throws(promiseHandler());

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({})`, async t => {
  const error = await t.throws(promiseHandler({}));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'error' })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'error' }));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'Error' })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'Error' }));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'ERROR' })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'ERROR' }));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'error', code: ${ fatalError.code } })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'ERROR', code: fatalError.code }));

  t.is(error.code, fatalError.code, `has a 'code' property and be equal to ${ fatalError.code }`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'error', code: ${ fatalError.code }, message: ${ fatalError.message } })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'ERROR', code: fatalError.code, message: fatalError.message }));

  t.is(error.code, fatalError.code, `has a 'code' property and be equal to ${ fatalError.code }`);
  t.is(error.message, fatalError.message, `has a 'message' property and be equal to ${ fatalError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ type: 'error', code: ${ fatalError.code }, message: ${ fatalError.message }, status: ${ fatalError.status } })`, async t => {
  const error = await t.throws(promiseHandler({ type: 'ERROR', code: fatalError.code, message: fatalError.message, status: fatalError.status }));

  t.is(error.code, fatalError.code, `has a 'code' property and be equal to ${ fatalError.code }`);
  t.is(error.message, fatalError.message, `has a 'message' property and be equal to ${ fatalError.message }`);
  t.is(error.status, fatalError.status, `has a 'status' property and be equal to ${ fatalError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler(new Error(${ fatalError.message }))`, async t => {
  const error = await t.throws(promiseHandler(new Error(fatalError.message)));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to ${ defaultError.code }`);
  t.is(error.message, fatalError.message, `has a 'message' property and be equal to ${ fatalError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler(new Error(${ fatalError.message }), ${ fatalError.code }))`, async t => {
  const error = await t.throws(promiseHandler(new Error(fatalError.message), fatalError.code));

  t.is(error.code, fatalError.code, `has a 'code' property and be equal to ${ fatalError.code }`);
  t.is(error.message, fatalError.message, `has a 'message' property and be equal to ${ fatalError.message }`);
  t.is(error.status, defaultError.status, `has a 'status' property and be equal to ${ defaultError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler(new Error(${ fatalError.message }), ${ fatalError.code }, false, ${ fatalError.status })`, async t => {
  const error = await t.throws(promiseHandler(new Error(fatalError.message), fatalError.code, false, fatalError.status));

  t.is(error.code, fatalError.code, `has a 'code' property and be equal to ${ fatalError.code }`);
  t.is(error.message, fatalError.message, `has a 'message' property and be equal to ${ fatalError.message }`);
  t.is(error.status, fatalError.status, `has a 'status' property and be equal to ${ fatalError.status }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#promiseHandler({ foo: ${ notAnError.foo } })`, async t => {
  const data = await promiseHandler(notAnError);

  t.is(data.foo, notAnError.foo,  `has a 'foo' property and be equal to ${ notAnError.foo }`);
  t.false(data instanceof Error, `in a instance of anything but not an error`);
});

test(`#promiseHandler('${ notAnError.foo }')`, async t => {
  const data = await promiseHandler(notAnError.foo);

  t.is(data, notAnError.foo,  `has to be equal to ${ notAnError.foo }`);
  t.false(data instanceof Error, `in a instance of anything but not an error`);
});
