'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
const token = 'sunshichaung';
class AuthController extends Controller {
  async auth() {
    console.log(11111111);
    const ctx = this.ctx;
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const nonce = ctx.query.nonce;
    const echostr = ctx.query.echostr;
    console.log(signature);
    console.log(timestamp);
    console.log(nonce);
    console.log(echostr);
    //1.将token、timestamp和nonce按字母排序排序，并转成字符串拼成一个
    const array = new Array(token,timestamp,nonce);
    array.sort();
    const str = array.toString().replace(/,/g,"");

    //2.将拼接后的字符串进行sha1加密
    const sha1Code = crypto.createHash('sha1');

    const code = sha1Code.update(str, 'utf-8').digest("hex");
    console.log("======"+code);

    //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (code === signature){
      ctx.body = echostr;
    } else {
        ctx.body = 'error';
    }
  }
}

module.exports = AuthController;
