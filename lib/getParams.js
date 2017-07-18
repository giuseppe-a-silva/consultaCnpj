const request = require('request-promise-native');
const buildPromise = require('./buildPromise');
const validateRequest = require('./validateRequest');
const generateImageBase64 = require('./generateImageBase64');

const getData = () =>
  request({
    encoding: null,
    url: 'http://www.receita.fazenda.gov.br/PessoaJuridica/CNPJ/cnpjreva/captcha/gerarCaptcha.asp',
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

const processSessionId = r =>
  r.headers['set-cookie'][0].split('; ')[0];

const buildResult = r => ({
    sessionId: processSessionId(r),
    captcha: generateImageBase64(r.body),
  });

const parseResponse = r =>
  buildPromise(buildResult(r));

const getParams = () =>
  getData()
    .then(r => validateRequest(r, 'Impossível capturar o captcha!'))
    .then(parseResponse);

module.exports = getParams;
