'use strict';

const Controller = require('egg').Controller;


class UserController extends Controller {
	async userList() {
		await this.ctx.render('/user/index.ejs', {
			data: '',
		});
	}
}

module.exports = UserController;
