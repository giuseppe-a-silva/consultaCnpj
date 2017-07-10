# Consulta CNPJ

Módulo para consulta do CNPJ na base da Receita Federal do Brasil.

## Dependências

* [Cheerio.js](https://cheerio.js.org/)
* [Iconv-Lite](https://github.com/ashtuchkin/iconv-lite)
* [Request](https://github.com/request/request)
* [Request-Promise-Request](https://github.com/request/request-promise-native)

## Autor

* **Antonelli Santos** - [Antonelli Santos](https://github.com/antonellisantos)

## Quem Contribuiu

* **Jean Carlo Nascimento** - [Jean Carlo Nascimento](https://github.com/suissa)
* **Carlos Carvalho** - [Carlos Carvalho](https://github.com/josecarlosweb)

## Instalação

    $ npm i --save consultaCnpj

## Como Usar

### Utilitário: Unmask

Utilitário para retirar os caractéres não-numéricos.

```js
const cnpj = consultaCnpj.unmask('12.123.123/1234-12'); // 12123123123412
const cep = consultaCnpj.unmask('12.123-123'); // 12123123
const cpf = consultaCnpj.unmask('123.123.123-12'); // 12312312312
```

### Utilitário: Validate

Utilitário para validar o CNPJ.

```js
const result = consultaCnpj.validate('21.876.883/0001-78'); // true
const result = consultaCnpj.validate('21876883000178'); // true
const result = consultaCnpj.validate('00.000.000/0000-00'); // false
const result = consultaCnpj.validate('00000000000000'); // false
```

### Consultar o CNPJ

```js
const params = consultaCnpj.getParams(); // Objeto com o sessionId e captcha (em base64) ou erro.
const data = consultaCnpj.getBasicInfos('21.876.883/0001-78', sessionId, 'solvedCaptcha'); // Objeto com as informações do CNPJ ou erro.
const moreData = consultaCnpj.getAdvancedInfos(sessionId); // Objeto com as informações de QSA e Capital social ou erro.
```

### [Exemplo](https://github.com/antonellisantos/consultaCnpj/tree/master/example)

    $ npm run example

## Licença

Este projeto é licenciado sob o modelo MIT License - veja [LICENSE.md](LICENSE.md) para mais detalhes.

