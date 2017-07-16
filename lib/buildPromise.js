const isErrorObject = (p) =>
  (typeof p === 'object'
    && (p.type === 'error'
      || p.type === 'Error'
      || p.type === 'ERROR'));

const rejectParam = (e) =>
  ((e instanceof Error)
    ? e
    B: new Error (e.message || 'Erro interno!'));

const buildPromise = (param) =>
  new Promise((resolve, reject) =>
    ((param instanceof Error
      || isErrorObject(param))
    ? reject(rejectParam(param))
    : resolve(param));

module.exports = buildPromise;
