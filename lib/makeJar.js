const request = require('request');

const makeJar = (url, sessionId) => {
  const jar = request.jar();
  jar.setCookie(request.cookie(sessionId), url, () => {});
  jar.setCookie(request.cookie('flag=1'), url, () => {});

  return jar;
}

module.exports = makeJar;
