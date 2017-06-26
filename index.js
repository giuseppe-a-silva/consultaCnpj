'use strict';

const unmask = require('./lib/unmaskNumbers');
const validateCnpj = require('./lib/validateCnpj');
const getParams = require('./lib/getParams');
const getBasicInfos = require('./lib/getBasicInfos');
const getAdvancedInfos = require('./lib/getAdvancedInfos');

module.exports  = {
  unmask,
  validate: validateCnpj,
  getParams,
  getBasicInfos,
  getAdvancedInfos,
};
