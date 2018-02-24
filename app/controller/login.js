'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async logined() {
    const ctx = this.ctx;
    const userId = ctx.session.userId;
    const loginInfo = {};
  }
  async loginIn() {
    const ctx = this.ctx;
    const user = await ctx.service.login.getLoginInfo(ctx.request.body.userName, ctx.request.body.passWord);
    if (user != null && user[0] != null) {
      ctx.session.userId = user[0].id;
      ctx.session.userName = user[0].user_name;
      ctx.session.userLevel = user[0].user_level;
      // ctx.session.loginInfo = user[0];
      ctx.status = 302;
      ctx.redirect('/');
    }
  }
  async loginOut() {
    const ctx = this.ctx;
    ctx.session = null;
    ctx.redirect('/toLogin');
    ctx.body = '退出成功！';
  }
}

module.exports = LoginController;
