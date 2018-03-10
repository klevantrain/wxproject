'use strict';

const request = require('request');
const config = require('../common/config');
const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      data,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }

  //回复文本消息
  send(data){
    //tousername  发送者openid
   const resMsg = '<xml>' +
      '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
      '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
      '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
      '<MsgType><![CDATA[text]]></MsgType>' +
      '<Content><![CDATA[' + data.content + ']]></Content>' +
      '</xml>';
  }

  async getAccessToken(ctx){
    // const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret='+config.AppSecret ;
    //
    // const aaa = request(url, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     ctx.ceshi = body; // 打印google首页
    //   }
    //   console.log(ctx.ceshi)
    // })
    // console.log(aaa);

    // const ctx = this.ctx;
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret='+config.AppSecret ;
    const result = await ctx.curl(url, {
      dataType: 'json',
    });
    return result.data;
  }
  async getWxUserInfo(access_token, openId,ctx) {
    // const ctx = this.ctx;
    const url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openId + '&lang=zh_CN';
    const result = await ctx.curl(url, {
      dataType: 'json',
    });

    return result.data;
  }
}
module.exports = BaseController;
