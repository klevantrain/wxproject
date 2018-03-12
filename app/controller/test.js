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
    const result = await ctx.curl('https://api.3023.com/apple/activationlock?sn=F17S24BSH2XW', {
      // data: {key : '6d278cde16510d142a8f7667a4792a28',},
      dataType: 'json',
      headers: {
        'key': '6d278cde16510d142a8f7667a4792a28',
        // 'key': 'eb7b94e4ca2da62a',
      },
    });

    ctx.body = result;
  }



}

module.exports = TestController;
