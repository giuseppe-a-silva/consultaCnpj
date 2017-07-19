const cheerio = require('cheerio');
const request = require('request-promise-native');
const buildPromise = require('./buildPromise');
const getBodyAndEncode = require('./getBodyAndEncode');
const validateRequest = require('./validateRequest');
const unmasker = require('./unmaskNumbers');
const makeJar = require('./makeJar');

const asterixRegex = /^([*]{1,})$/;
const dashedStringRegex = /^\d+-[a-zA-Z0-9]+$/;

const getData = sessionId =>
  request({
    encoding: null,
    url: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_qsa.asp',
    jar: makeJar('http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_qsa.asp', sessionId),
    method: 'GET',
    followAllRedirects: true,
    resolveWithFullResponse: true,
    headers: {
      Host: 'www.receita.fazenda.gov.br',
      Connection: 'keep-alive',
      'Upgrade-Insecure-Requests': 1,
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      Referer: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_Comprovante.asp',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
    },
  });

const checkBodyForErrors = (body) => {
  const $ = cheerio.load(body);

  const manipulatedString = $('div > body > table:nth-child(6) > tr > td > table:nth-child(1) > tr > td').text();
  if (!manipulatedString.startsWith('O Quadro de Sócios e Administradores(QSA) constante da base de dados do Cadastro Nacional da Pessoa Jurídica (CNPJ) é o seguinte:')) {
    return buildPromise(new Error('Impossível capturar o QSA!'));
  }

  return buildPromise(body);
};

const convertValueToFloat = s =>
  parseFloat([
    unmasker(s).slice(0, (unmasker(s).length - 2)),
    unmasker(s).slice((unmasker(s).length - 2), unmasker(s).length),
  ].join('.'));

const extractDataCapitalSocial = elem =>
  ({
    k: elem.eq(0).text().trim(),
    v: elem.eq(1).text().trim(),
  });

const hasCapitalSocialInfo = (k, v) =>
  !(k.startsWith('CAPITAL SOCIAL:')
    && (asterixRegex.test(v)
      || v.includes('Não informada')
      || !v));

const processCodeAndDescriptions = s =>
  ((dashedStringRegex.test(s))
    ? ({
      CÓDIGO: unmasker(s.split('-')[0]),
      DESCRIÇÃO: s.split('-')[1].trim(),
    })
    : s);

const parseExtractedDataFromBody = (body) => {
  const $ = cheerio.load(body);
  const result = {};
  const partners = [];
  let partner = {};
  let base;

  base = $('div > body > table:nth-child(4) > tr > td > table > tr:nth-child(3) > td');
  let { k, v } = extractDataCapitalSocial(base);
  if (hasCapitalSocialInfo(k, v)) {
    result['CAPITAL SOCIAL'] = convertValueToFloat(v);
  }

  base = $('div > body > table:nth-child(6) > tr > td > table:nth-child(3) > tr > td[width="100%"][valign="top"] > fieldset > table > tr > td > table > tr > td');
  base.each((i, elem) => {
    if ($(elem).text().trim().startsWith('Nome/Nome Empresarial:') || i === (base.length - 1)) {
      if (i !== 0) {
        partners.push(partner);
      }

      partner = {};
    }

    if (i % 2 === 0) {
      [k, v] = [
        base.eq(i).text().trim().toUpperCase(),
        base.eq(i + 1).text().trim(),
      ];

      partner[k] = processCodeAndDescriptions(v);
    }
  });
  result.QSA = partners;

  return buildPromise(result);
};

const getAdvancedInfos = sessionId =>
  ((!sessionId)
    ? buildPromise(new Error('Valores informados são inválidos!'))
    : getData(sessionId)
      .then(r => validateRequest(r, 'Impossível recuperar as informações do QSA para o CNPJ informado!'))
      .then(getBodyAndEncode)
      .then(checkBodyForErrors)
      .then(parseExtractedDataFromBody));

module.exports = getAdvancedInfos;
