'use strict';

const Controller = require('../core/base_controller');
const xml2js = require('xml2js');

const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

class TestController extends Controller {
  async test() {
    const ctx = this.ctx;
    const xml =  "<xml><ToUserName><![CDATA[gh_315c5b5be43b]]></ToUserName><FromUserName><![CDATA[oM8KH1UfGELrygbylVVFIMau9YsU]]></FromUserName><CreateTime>1520138728</CreateTime><MsgType><![CDATA[event]]></MsgType><Event><![CDATA[unsubscribe]]></Event><EventKey><![CDATA[]]></EventKey></xml>";


    xmlParser.parseString(xml, function (err, result) {
    //将返回的结果再次格式化
     console.log(JSON.stringify(result.xml));
     ctx.body = JSON.stringify(result.xml);
  });

  }
  async request() {
    const ctx = this.ctx;
    let token = '';
    await this.getAccessToken(ctx).then(function (result){
          token = result.access_token;
    });
    const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token, {
      // data: {key : '6d278cde16510d142a8f7667a4792a28',},
      // 必须指定 method
      method: 'POST',
      // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
      contentType: 'json',
      data: {
              touser:"oyLgv1g8J7H6_RRWo6cg_0W-qnnU",
              msgtype:"text",
              text:
              {
                "content":"Hello World"
              }
            },
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    // console.log(JSON.stringify(result));
    ctx.body = result;
  }



}

module.exports = TestController;
