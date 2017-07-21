const isErrorObject = p =>
  (typeof p === 'object'
    && (p.type === 'error'
      || p.type === 'Error'
      || p.type === 'ERROR'));

const hasErrorCode = e =>
  ('code' in e);

const assignCodeToError = (e, c) =>
  Object.assign(e, { code: c });

const isEmptyObject = o =>
  (o
    && (o instanceof Object)
    && !(Object.keys(o).length));

const solvePromise = (resolve, reject, args) => {
  let [d = false, c = (d.code || 500), m = (d.message || 'Erro interno!')] = args;

  if (args.length > 3
      || !d
      || isErrorObject(d)
      || isEmptyObject(d)) {
    d = new Error(m);
  }

  if ((d instanceof Error)
      && !hasErrorCode(d)) {
    d = assignCodeToError(d, c);
  }

  if (!(d instanceof Error)) {
    return resolve(d);
  }

  return reject(d);
};

const promiseHandler = (...args) =>
  new Promise((resolve, reject) =>
    solvePromise(resolve, reject, args));

module.exports = promiseHandler;

