'use strict';

const Controller = require('../core/base_controller');
const request = require('request');
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
    request('http://www.google.com', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // 打印google首页
      }
    })
  }



}

module.exports = TestController;
