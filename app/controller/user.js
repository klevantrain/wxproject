'use strict';

const Controller = require('egg').Controller;


class UserController extends Controller {

	async createUser() {
		const ctx = this.ctx;
    const user = await ctx.service.user.createUser(ctx.request.body);
		if (user === true) {
			ctx.body = 'success';
			ctx.status = 200;
		}

	}
	async userList() {
		if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
			await this.ctx.render('/user/index.ejs', {
				data: '',
			});
		}
	}

	async getUserInfo() {
		const ctx = this.ctx;
		if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
	    const user = await ctx.service.user.find(ctx.request.body);
	    ctx.body = user;
			ctx.status = 200;
		}
	}
  async updateUserBalance() {
		const ctx = this.ctx;
		if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
	    const result = await ctx.service.user.updateUserBalance(ctx.request.body);
			if(!result){
				ctx.status = 504;
			}else{
				const user = await ctx.service.user.find(ctx.request.body);
				ctx.status = 200;
				ctx.body = user;
			}
		}
	}
	async managerUserBlance() {
		const ctx = this.ctx;
    const result = await ctx.service.user.managerUserBlance(ctx.request.body,ctx.session.userId);
		if(result === 1 ){
			ctx.status = 501;
		} else if (result === 2){
			ctx.status = 502;
		}else if(result){
			ctx.status = 200;
		}
	}



}

module.exports = UserController;
