'use strict';

const consultaCnpj = require('../index');
const cors = require('kcors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const send = require('koa-send');
const Koa = require('koa');
const Router = require('koa-router');

const router = new Router();

const app = new Koa();
app.use(cors());
app.use(logger());
app.use(bodyParser());

router.get('/captcha', async (ctx, next) => {
  try {
    ctx.body = await consultaCnpj.getParams();
  } catch(e) {
    ctx.body = {
      error: {
        message: e.message,
        code: e.code,
      }
    };
    ctx.status = e.status;
    console.log(e);
  }
});

router.post('/basicInfos', async (ctx, next) => {
  const [cnpj, sessionId, solvedCaptcha] = [ctx.request.body.cnpj, ctx.request.body.sessionId, ctx.request.body.solvedCaptcha];
  try {
    ctx.body = await consultaCnpj.getBasicInfos(cnpj, sessionId, solvedCaptcha);
  } catch(e) {
    ctx.body = {
      error: {
        message: e.message,
        code: e.code,
      }
    };
    ctx.status = e.status;
    console.log(e);
  }
});

router.post('/advancedInfos', async (ctx, next) => {
  const sessionId = ctx.request.body.sessionId;
  try {
    ctx.body = await consultaCnpj.getAdvancedInfos(sessionId);
  } catch(e) {
    ctx.body = {
      error: {
        message: e.message,
        code: e.code,
      }
    };
    ctx.status = e.status;
    console.log(e);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async ctx => {
  await send(ctx, '/example/index.html');
});

app.listen(8888, () => console.log('Listening on port 8888!'));
