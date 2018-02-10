'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async login() {
    await this.ctx.render('/login/index.ejs', {
      data: '请登录！',
    });
  }
  async index() {
    const ctx = this.ctx;

    const userId = ctx.session.userId;
    if (userId === null || userId === undefined || userId === "") {
      await this.ctx.render('/login/index.ejs', {
        data: '请登录！',
      });
    } else {
      const user = await ctx.service.manager.find(userId);
      console.log(user.user_level)
      if(user!=null && user!=undefined&& user.user_level == "top"){
        await ctx.render('/home/index.ejs', {
          data: '欢迎你' + userId,
        });
      }else{
        await this.ctx.render('/login/index.ejs', {
          data: '请登录！',
        });
      }

    }
  }


}

module.exports = HomeController;
