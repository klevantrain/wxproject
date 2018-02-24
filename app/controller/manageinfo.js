'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
  async toSecond() {
    await this.ctx.render('/secondManager/index.ejs', {
      data: '请登录！',
    });
  }
  async find() {
    const ctx = this.ctx;
    const userId = ctx.params.id;
    const user = await ctx.service.manager.find(1);
    ctx.body = user;
  }

  async getManageInfo() {

    const ctx = this.ctx;
    if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
      const user = await ctx.service.manager.getManageInfo(ctx.request.body);
      ctx.body = user;
      ctx.status = 200;
    }
  }
  async updateManage() {
    const ctx = this.ctx;
    if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
      const result = await ctx.service.manager.updateManage(ctx.request.body);
      if(!result){
  			ctx.status = 504;
  		}else{
  			const user = await ctx.service.manager.getManageInfo({});
  			ctx.status = 200;
  			ctx.body = user;
  		}
    }
  }
  async deleteManageInfo() {
    const ctx = this.ctx;
    if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
      const result = await ctx.service.manager.deleteManageInfo(ctx.request.body);
      if(!result){
  			ctx.status = 504;
  		}else{
  			const user = await ctx.service.manager.getManageInfo({});
  			ctx.status = 200;
  			ctx.body = user;
  		}
    }
  }

    async managerAdd() {
      const ctx = this.ctx;
      if(ctx.session.userLevel!="top"){
        ctx.redirect('/toLogin');
      }else{
        const result = await ctx.service.manager.managerAdd(ctx.request.body);
        if(!result){
          ctx.status = 504;
        }else{
          // const user = await ctx.service.manager.getManageInfo({});
          ctx.status = 200;
          // ctx.body = user;
        }
      }
    }
}

module.exports = ManagerController;
