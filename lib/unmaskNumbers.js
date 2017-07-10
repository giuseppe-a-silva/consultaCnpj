const unmaskNumbers = num => num.match(/\d+/g).join('');

module.exports = unmaskNumbers;
