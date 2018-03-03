'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');
const token = 'sunshichaung';
const XMLJS = require('xml2js');
// //微信客户端各类回调用接口
// const EventFunction = {
//     //关注
//     subscribe: function(result, req, res) {
// //存入openid 通过微信的接口获取用户的信息同时存入数据库。
//     },
//     //注销
//     unsubscribe: function(openid, req, res) {
// //删除对应id
//     },
//     //打开某个网页
//     VIEW: function() {
// //根据需求，处理不同的业务
//     },
// //自动回复
//     responseNews: function(body, res) {
// //组装微信需要的json
//         var xml  = {xml: {
//             ToUserName: body.FromUserName,
//             FromUserName: body.ToUserName,
//             CreateTime: + new Date(),
//             MsgType: 'text',
//             Content: '编辑@+您想说的话，我们可以收到'
//         }};
//         var reciviMessage = body.Content[0]
//         if(/^\@.*/.test(reciviMessage)) {
//             xml.xml.Content = '已经收到您的建议，会及时处理！'
//         }//将json转为xml
//         xml = builder.buildObject(xml);//发送给微信
//         res.send(xml);
//     }
// };
class AuthController extends Controller {
  async auth() {
    const ctx = this.ctx;
    const signature = ctx.query.signature;
    const timestamp = ctx.query.timestamp;
    const nonce = ctx.query.nonce;
    const echostr = ctx.query.echostr;
    console.log(signature);
    console.log(timestamp);
    console.log(nonce);
    console.log(echostr);
console.log("=============================");
console.log(ctx.query);
console.log(ctx.request);

console.log(ctx.request.body);

    //1.将token、timestamp和nonce按字母排序排序，并转成字符串拼成一个
    const array = new Array(token,timestamp,nonce);
    array.sort();
    const str = array.toString().replace(/,/g,"");
    const sha1Code = crypto.createHash('sha1');
    const code = sha1Code.update(str, 'utf-8').digest("hex");
    //3.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
    if (code === signature){
      console.log("验证成功");
      ctx.body = echostr;
    } else {
        ctx.body = 'error';
    }
  }
}

module.exports = AuthController;
