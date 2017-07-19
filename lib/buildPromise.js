const isErrorObject = p =>
  (typeof p === 'object'
    && (p.type === 'error'
      || p.type === 'Error'
      || p.type === 'ERROR'));

const rejectParam = e =>
  ((e instanceof Error)
    ? e
    : new Error(e.message || 'Erro interno!'));

const buildPromise = p =>
  new Promise((resolve, reject) =>
    ((p instanceof Error
        || isErrorObject(p))
      ? reject(rejectParam(p))
      : resolve(p)));

module.exports = buildPromise;
