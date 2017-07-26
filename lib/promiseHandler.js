const isErrorObject = p =>
  (typeof p === 'object'
    && (p.type === 'error'
      || p.type === 'Error'
      || p.type === 'ERROR'));

const hasErrorStatus = e =>
  ('status' in e);

const assignStatusToError = (e, s) =>
  Object.assign(e, { status: s });

const hasErrorCode = e =>
  ('code' in e);

const assignCodeToError = (e, c) =>
  Object.assign(e, { code: c });

const isEmptyObject = o =>
  (o
    && (o instanceof Object)
    && !(Object.keys(o).length));

const setDefault = (p, d) =>
  p.map((e, i, a) => (!e ? d[i] : e));

const solvePromise = (resolve, reject, args) => {
  let [d = { type: 'error' }, c, m, s] = args;
  let _default = [(d.code || 101), (d.message || 'Erro interno!'), (d.status || 500)];

  [c, m, s] = setDefault([c, m, s], _default);

  if (isErrorObject(d)
    || isEmptyObject(d)) {
    d = new Error(m);
  }

  if (d instanceof Error) {
    d = (!hasErrorCode(d) ? assignCodeToError(d, c) : d);
    d = (!hasErrorStatus(d) ? assignStatusToError(d, s) : d);
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

