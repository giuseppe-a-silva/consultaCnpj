const request = require('request-promise-native');
const R = require('ramda');
const buildPromise = require('./buildPromise');
const validateRequest = require('./validateRequest');
const generateImageBase64 = require('./generateImageBase64');
const makeJar = require('./makeJar');

const firstRequest = () => request({
  encoding: null,
  url: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_Solicitacao2.asp',
  method: 'GET',
  resolveWithFullResponse: true
})

const requestData = session =>
  request({
    encoding: null,
    url: 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/captcha/gerarCaptcha.asp',
    jar: makeJar('http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/captcha/gerarCaptcha.asp', session),
    method: 'GET',
    resolveWithFullResponse: true,
    headers: {
      Host: 'www.receita.fazenda.gov.br',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Referer: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/cnpjreva_solicitacao2.asp',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
    },
  });

const getData = session =>
  requestData(session)

const validate = r =>
  validateRequest(r, 'Impossível capturar o captcha!')

const processSessionId = r =>
  r.headers['set-cookie'][0].split('; ')[0];

const buildResult = (sessionId, data) =>
  ({
    sessionId: sessionId,
    captcha: generateImageBase64(data.body),
  });

const curryBuildResult = R.curry(buildResult)

const promiseResolve = obj =>
  new Promise((resolve, reject) => getData(obj.sessionId)
    .then(data => resolve({ fn: obj.fn, data })))

const parseResponse = r =>
  buildPromise(buildResult(r));

const getParams = () =>
  firstRequest()
    .then(validate)
    .then(s => ({ fn: curryBuildResult(processSessionId(s)), sessionId: processSessionId(s) }))
    .then(promiseResolve)
    .then(obj => obj.fn(obj.data))
    .catch(e => console.log(e));

module.exports = getParams;
