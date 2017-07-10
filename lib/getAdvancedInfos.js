const cheerio = require('cheerio');
const request = require('request-promise-native');
const buildPromise = require('./buildPromise');
const getBodyAndEncode = require('./getBodyAndEncode');
const validateRequest = require('./validateRequest');
const unmasker = require('./unmaskNumbers');

const asterixRegex = /^([*]{1,})$/;

const getData = sessionId => {
  const jar = request.jar();
  jar.setCookie(request.cookie(sessionId), 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_qsa.asp', () => {});
  jar.setCookie(request.cookie('flag=1'), 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_qsa.asp', () => {});

  return request(
    {
      encoding: null,
      url: 'http://www.receita.fazenda.gov.br/pessoajuridica/cnpj/cnpjreva/Cnpjreva_qsa.asp',
      jar,
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
    }
  );
}

const checkBodyForErrors = body => {
  const $ = cheerio.load(body);

  const manipulatedString = $('div > body > table:nth-child(6) > tr > td > table:nth-child(1) > tr > td').text();
  if (!manipulatedString.startsWith('O Quadro de Sócios e Administradores(QSA) constante da base de dados do Cadastro Nacional da Pessoa Jurídica (CNPJ) é o seguinte:')) {
    return buildPromise(new Error('Impossível capturar o QSA!'));
  }

  return buildPromise(body);
}

const convertValueToFloat = string => {
  const unmasked = unmasker(string);
  const real = [
    unmasked.slice(0, (unmasked.length - 2)),
    unmasked.slice((unmasked.length - 2), unmasked.length),
  ].join('.');

  return parseFloat(real);
}

const processValue = elem => {
  const [key, value] = [
    elem
      .eq(0)
      .text()
      .trim(),
    elem
      .eq(1)
      .text()
      .trim(),
  ];

  if (key.startsWith('CAPITAL SOCIAL:')
    && (asterixRegex.test(value)
    || value.includes('Não informada')
    || value === null
    || value === undefined
    || value === '')) {
    return null;
  }

  return convertValueToFloat(value);
}

const processCodeAndDescriptions = string => {
  const regex = /^\d+-[a-zA-Z0-9]+$/;
  if (regex.test(string)) {
    const processedString = string.split('-');

    return {
      CÓDIGO: unmasker(processedString[0]),
      DESCRIÇÃO: processedString[1].trim(),
    };
  }

  return string;
}

const parseExtractedDataFromBody = body => {
  const $ = cheerio.load(body);
  const result = {};

  let base = $('div > body > table:nth-child(4) > tr > td > table > tr:nth-child(3) > td');
  result['CAPITAL SOCIAL'] = processValue(base);

  base = $('div > body > table:nth-child(6) > tr > td > table:nth-child(3) > tr > td[width="100%"][valign="top"] > fieldset > table > tr > td > table > tr > td');
  let partner = {};
  const partners = [];
  base.each((i, elem) => {
    if ($(elem).text().trim().startsWith('Nome/Nome Empresarial:') || i === (base.length - 1)) {
      if (i !== 0) {
        partners.push(partner);
      }
      partner = {};
    }
    if (i % 2 === 0) {
      partner[
        base
        .eq(i)
        .text()
        .trim()
        .toUpperCase()
      ] = processCodeAndDescriptions(base
        .eq(i + 1)
        .text()
        .trim());
    }
  });
  result.QSA = partners;

  return buildPromise(result);
}

const getAdvancedInfos = sessionId =>
  (!sessionId)
  ? buildPromise(new Error('Valores informados são inválidos!'))
  : getData(sessionId)
      .then(response => validateRequest(response, 'Impossível recuperar as informações do QSA para o CNPJ informado!'))
      .then(getBodyAndEncode)
      .then(checkBodyForErrors)
      .then(parseExtractedDataFromBody);

module.exports = getAdvancedInfos;
