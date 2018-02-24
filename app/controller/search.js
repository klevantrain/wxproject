'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  async getSearchLog() {
    const ctx = this.ctx;
    if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
      const user = await ctx.service.search.getSearchLog(ctx.request.body);
      ctx.body = user;
      ctx.status = 200;
    }
  }
}

module.exports = SearchController;
