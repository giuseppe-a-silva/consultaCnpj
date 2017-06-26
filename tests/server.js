'use strict';

const consultaCnpj = require('../index');
const koa = require('koa');
const cors = require('kcors');
const logger = require('koa-logger');
const router = new require('koa-router')();
const bodyParser = require('koa-bodyparser');

const app = new koa();
app.use(cors());
app.use(logger());
app.use(bodyParser());

router.get('/captcha', async function (ctx, next) {
  try {
    ctx.body = await consultaCnpj.getCaptcha();
  } catch(e) {
    ctx.body = {
      error: e.message,
    };
    ctx.status = 400;
    console.log(e);
  }
});

router.post('/infos', async function (ctx, next) {
  const [cnpj, sessionId, solvedCaptcha] = [ctx.request.body.cnpj, ctx.request.body.sessionId, ctx.request.body.solvedCaptcha];
  try {
    ctx.body = await consultaCnpj.getBasicInfos(cnpj, sessionId, solvedCaptcha);
  } catch(e) {
    ctx.body = {
      error: e.message,
    };
    ctx.status = 400;
    console.log(e);
  }
});

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(8888, () => console.log('Listening on port 8888!'));
