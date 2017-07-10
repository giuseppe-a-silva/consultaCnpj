'use strict';

const chai = require('chai');
const chaiString = require('chai-string');

const getParams = require('../lib/getParams');
const buildPromise = require('../lib/buildPromise');
const validateRequest = require('../lib/validateRequest');
const generateImageBase64 = require('../lib/generateImageBase64');
const getBodyAndEncode = require('../lib/getBodyAndEncode');
const consultaCnpj = require('../index');

const validCnpj = '21.876.883/0001-78';

chai.use(chaiString);

const expect = chai.expect;

describe('ConsultaCNPJ API', () => {

  describe('#buildPromise(new Error(\'Falha geral!\'))', () => {
    it('should return an Error', () => {
      const message = 'Falha geral!';
      return buildPromise(new Error(message))
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal(message);
        });
    });
  });

  describe('#buildPromise({type: \'error\'})', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'error'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise({type: \'Error\'})', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'Error'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise({type: \'ERROR\'})', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'ERROR'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise(null)', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'error'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise(undefined)', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'error'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise(\'\')', () => {
    it('should return an Error', () => {
      return buildPromise({type: 'error'})
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Erro interno!');
        });
    });
  });

  describe('#buildPromise(null)', () => {
    it('should return an Error', () => {
      const data = 'Informação qualquer!';
      return buildPromise(data)
        .then(x => {
          expect(x).to.exist.and.be.a('string');
          expect(x).to.be.equal(data);
        });
    });
  });

  describe('#validateRequest(mockedFailRequest, message)', () => {
    it('should return an error', () => {
      const mockedFailRequest = {statusCode: 404};
      const message = 'Não encontrado!';
      return validateRequest(mockedFailRequest, message)
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal(message);
        });
    });
  });

  describe('#validateRequest(mockedSuccessRequest)', () => {
    it('should return an object', () => {
      const mockedSuccessRequest = {statusCode: 200};
      return validateRequest(mockedSuccessRequest)
        .then(data => {
          expect(data).to.exist.and.be.a('object');
          expect(data).to.be.equal(mockedSuccessRequest);
        });
    });
  });

  describe('#generateImageBase64(mockedFailBody)', () => {
    it('should return an Error', () => {
      const mockedFailBody = '4458555212355';
      return generateImageBase64(mockedFailBody)
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Impossível gerar a imagem!');
        });
    });
  });

  describe('#getBodyAndEncode(response)', () => {
    it('should return a string', () => {
      const response = {body: 'Lorem ipsum dolor...'};
      return getBodyAndEncode(response)
        .then(data => {
          expect(data).to.exist.and.be.a('string');
          expect(data).to.be.equal(response.body);
        });
    });
  });

  describe('#unmask("12.123.123/1234-12")', () => {
    it('should return the unmasked CNPJ (only numbers)', done => {
      expect(consultaCnpj.unmask("12.123.123/1234-12")).to.be.a('string').and.match(/^\d+$/);
      done();
    });
  });

  describe('#validate(#unmask("12.123.123/1234-12"))', () => {
    it('should return false', done => {
      expect(consultaCnpj.validate(consultaCnpj.unmask("12.123.123/1234-12"))).to.be.a('boolean').and.be.equal(false);
      done();
    });
  });

  describe('#validate(#unmask("00.000.000/0000-00"))', () => {
    it('should return false', done => {
      expect(consultaCnpj.validate(consultaCnpj.unmask("00.000.000/0000-00"))).to.be.a('boolean').and.be.equal(false);
      done();
    });
  });

  describe('#validate("123")', () => {
    it('should return false', done => {
      expect(consultaCnpj.validate("123")).to.be.a('boolean').and.be.equal(false);
      done();
    });
  });

  describe('#validate(#unmask("21.876.883/0001-79"))', () => {
    it('should return false', done => {
      expect(consultaCnpj.validate(consultaCnpj.unmask("21.876.883/0001-79"))).to.be.a('boolean').and.be.equal(false);
      done();
    });
  });

  describe(`#validate(unmask(${validCnpj}))`, () => {
    it('should return true', done => {
      expect(consultaCnpj.validate(consultaCnpj.unmask(validCnpj))).to.be.a('boolean').and.be.equal(true);
      done();
    });
  });

  describe('#getParams()', () => {
    it('should return an object', () => {
      return consultaCnpj.getParams()
        .then(data => {
          expect(data).to.be.a('object');
          expect(data).to.have.property('sessionId');
          expect(data).to.have.property('captcha');
          expect(data.sessionId).to.be.a('string').and.startsWith('ASPSESSIONID');
        });
    });
  });

  describe('#getBasicInfos(null, \'sessionId\', \'solvedCaptcha\')', () => {
    it('should return an Error', () => {
      return consultaCnpj.getBasicInfos(null, 'sessionId', 'solvedCaptcha')
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Valores informados são inválidos!');
        });
    });
  });

  describe('#getBasicInfos(\'cnpj\', null, \'solvedCaptcha\')', () => {
    it('should return an Error', () => {
      return consultaCnpj.getBasicInfos('cnpj', null, 'solvedCaptcha')
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Valores informados são inválidos!');
        });
    });
  });

  describe('#getBasicInfos(\'cnpj\', \'sessionId\', null)', () => {
    it('should return an Error', () => {
      return consultaCnpj.getBasicInfos('cnpj', 'sessionId', null)
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('Valores informados são inválidos!');
        });
    });
  });

  describe('#getBasicInfos(\'00.000.000/0000-00\', \'sessionId\', \'solvedCaptcha\')', () => {
    it('should return an Error', () => {
      return consultaCnpj.getBasicInfos('00.000.000/0000-00', 'sessionId', 'solvedCaptcha')
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('O CNPJ informado não é válido!');
        });
    });
  });

  describe(`#getBasicInfos(${validCnpj}, 'sessionId', 'solvedCaptcha')`, () => {
    it('should return an Error', () => {
      return consultaCnpj.getBasicInfos(validCnpj, 'sessionId', 'solvedCaptcha')
        .catch(error => {
          expect(error).to.exist.and.be.a.instanceof(Error);
          expect(error.message).to.be.equal('O captcha informado é inválido!');
        });
    });
  });

});
