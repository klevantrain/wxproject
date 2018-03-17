'use strict';

const Controller = require('egg').Controller;

class DingController extends Controller {
  async contactUs() {
    await this.ctx.render('/dingdang/index.ejs', {
      data: '',
    });
  }

}

module.exports = DingController;
