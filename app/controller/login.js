'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
  async logined() {
    const ctx = this.ctx;
    let userId = ctx.cookies.get('userId');
    if(userId === null || userId === undefined || userId === ""){
      console.log(123123)
      ctx.render('/public/home/index.html', "result");
      return;
    }
    // ctx.cookies.set('count', ++count);
    ctx.body = "21312";
  }
  async login() {
    const ctx = this.ctx;
    const user = await ctx.service.login.getLoginInfo(ctx.request.body.userName, ctx.request.body.passWord);
    console.log(93842342347237423749)
    console.log(user[0].id)
    if(user != null && user[0]!=null){
      ctx.status = 302;
      ctx.redirect('/test');
      ctx.body = 'Redirecting to shopping cart';
    }
    ctx.cookies.set('userId', user[0].id);
  }
  async ceshi() {
    const ctx = this.ctx;
    const userId = ctx.cookies.get('userId');
    if(userId === null || userId === undefined || userId === ""){
      await ctx.render('/test/test.ejs', {
        data: '请登录！',
      });
    }else{
      await ctx.render('/test/test.ejs', {
        data: '欢迎你'+userId,
      });
    }
  }
}

module.exports = LoginController;
