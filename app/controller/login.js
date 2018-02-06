'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async logined() {
    const ctx = this.ctx;
    let userId = ctx.session.userId;
    if (userId === null || userId === undefined || userId === "") {
      console.log(123123)
      ctx.render('/public/home/index.html', "result");
      return;
    }
  }
  async loginIn() {
    const ctx = this.ctx;
    const user = await ctx.service.login.getLoginInfo(ctx.request.body.userName, ctx.request.body.passWord);
    console.log(93842342347237423749)
    console.log(user[0].id)
    if (user != null && user[0] != null) {
      ctx.status = 302;
      ctx.redirect('/userHome');
    }
    ctx.session.userId = user[0].id;
  }
  async loginOut() {
    const ctx = this.ctx;
    ctx.session = null;
    ctx.redirect('/toLogin');
    ctx.body = '退出成功！';
  }
  async ceshi() {
    const ctx = this.ctx;
    const userId = ctx.session.userId;
    if (userId === null || userId === undefined || userId === "") {
      await ctx.render('/test/test.ejs', {
        data: '请登录！',
      });
    } else {
      await ctx.render('/test/test.ejs', {
        data: '欢迎你' + userId,
      });
    }
  }
}

module.exports = LoginController;
