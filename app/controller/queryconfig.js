'use strict';

const Controller = require('egg').Controller;


class QueryConfigController extends Controller {
	async getPriceConfigInfo() {
		const ctx = this.ctx;
    if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }{
      const priceConfig = await ctx.service.queryconfig.getQueryList();
      ctx.body = priceConfig;
  		ctx.status = 200;
    }
	}
  async updateQueryPrice() {
		const ctx = this.ctx;
		if(ctx.session.userLevel!="top"){
      ctx.redirect('/toLogin');
    }else{
      const params = {};
      params.id = ctx.request.body.id;
      params.price = ctx.request.body.balance;
	    const result = await ctx.service.queryconfig.updateQueryConfigPrice(params);
      if(!result){
				ctx.status = 504;
			}else{
				const user = await ctx.service.queryconfig.getQueryList();
				ctx.status = 200;
				ctx.body = user;
			}




      ctx.status = 200;
    }
	}

}

module.exports = QueryConfigController;
