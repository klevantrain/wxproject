'use strict';

const Controller = require('egg').Controller;

class ManagerController extends Controller {
  async find() {
    const ctx = this.ctx;
    const userId = ctx.params.id;
    const user = await ctx.service.manager.find(1);
    ctx.body = user;
  }
}

module.exports = ManagerController;
