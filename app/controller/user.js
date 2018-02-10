'use strict';

const Controller = require('egg').Controller;


class UserController extends Controller {
	async userList() {
		await this.ctx.render('/user/index.ejs', {
			data: '',
		});
	}

	async getUserInfo() {
		const ctx = this.ctx;
    const user = await ctx.service.user.find(ctx.request.body);
    ctx.body = user;
		ctx.status = 200;
	}
  async updateUserBalance() {
		console.log(12123123123)
		const ctx = this.ctx;
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

module.exports = UserController;
