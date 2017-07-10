const buildPromise = (param) => new Promise( (resolve, reject) => {
  if (param instanceof Error) {
    return reject(param);
  } else if ( (typeof param === 'object'
    && (param.type === 'error'
      || param.type === 'Error'
      || param.type === 'ERROR') )
  || !param
  || param === null
  || param === undefined
  || param === '') {
    const message = param.message || 'Erro interno!';
    return reject( new Error(message) );
  }

  return resolve(param);
});

module.exports = buildPromise;
