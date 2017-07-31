import { test } from 'ava';
import validateRequest from '../lib/validateRequest';

const failedRequest = {
  statusCode: 404,
};
const successedRequest = {
  statusCode: 200,
};
const defaultError = {
  code: 1,
  message: 'Falha na requisição! Por favor, tente novamente!',
};

test(`#validateRequest({ statusCode: ${ failedRequest.statusCode } })`, async t => {
  const error = await t.throws(validateRequest(failedRequest));

  t.is(error.code, defaultError.code, `has a 'code' property and be equal to 1`);
  t.is(error.message, defaultError.message, `has a 'message' property and be equal to ${ defaultError.message }`);
  t.is(error.status, failedRequest.statusCode, `has a 'status' property and be equal to ${ failedRequest.statusCode }`);
  t.true(error instanceof Error, `in a instance of error`);
});

test(`#validateRequest({ statusCode: ${ successedRequest.statusCode } })`, async t => {
  const data = await validateRequest(successedRequest);

  t.is(data, successedRequest);
});
