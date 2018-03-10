'use strict';

const Controller = require('../core/base_controller');

const crypto = require('crypto');
const token = 'sunshichaung';
const XMLJS = require('xml2js');
class AuthController extends Controller {
  async auth() {
    const ctx = this.ctx;
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const nonce = ctx.query.nonce;
    const echostr = ctx.query.echostr;
    //1.将token、timestamp和nonce按字母排序排序，并转成字符串拼成一个
    const array = new Array(token,timestamp,nonce);
    array.sort();
    const str = array.toString().replace(/,/g, '');
    const sha1Code = crypto.createHash('sha1');
    const code = sha1Code.update(str, 'utf-8').digest("hex");
    //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    console.log(signature);
    if (code === signature){
      ctx.body = 'success';
      // await this.dealRequest(ctx).then(function(result){
      //   // console.log("====="+result);
      //   ctx.body = result;
      // });
    } else {
        ctx.body = 'error';
    }
  }
  async dealRequest(ctx) {

    // const ctx = this.ctx;
    const requests = ctx.request.body;
    const _this = this;
    let resulBody = '1';
    let token = '';
    await _this.getAccessToken(ctx).then(function (result){
          token = result.access_token;
    });
    await _this.getWxUserInfo(token, requests.FromUserName,ctx).then(function (result2){
     //创建用户
     if (requests != null && requests.Event === 'subscribe'){
       // console.log("订阅处理"+result2.nickname);
       requests.nickName = result2.nickname;
       ctx.service.user.createUser(requests);
     }
     //删除用户
     if (requests != null && requests.Event === 'unsubscribe'){
       ctx.service.user.deleteWxUser(requests).then(function (result3){
         if(result3 === true){
             console.log("删除成功");
         }
       });
     }
     //点击事件
     if (requests != null && requests.Event === 'CLICK' && requests.EventKey === "IMEI" ){
         console.log("查询IEMI"+requests);
         // const
         const resMsg = '<xml>' +
            '<ToUserName><![CDATA[' + 'oyLgv1uXdzDWJ5PvuEBmB82R7JXA' + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + "gh_3fc2486c07f5" + ']]></FromUserName>' +
            '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
            '<MsgType><![CDATA[text]]></MsgType>' +
            '<Content><![CDATA[' + "你好啊" + ']]></Content>' +
            '</xml>';
         resulBody = resMsg;
     }
   });
    return resulBody;
  }

}

module.exports = AuthController;
