'use strict';

const payUtil = require('../common/utils');
const Controller = require('egg').Controller;

class PayController extends Controller {
  async getPayHtmlInfo() {
    const ctx = this.ctx;
    await ctx.render('/pay/index.ejs', {
        data: {
            openid:'12312'
        },
    });
  }
  async notifyUrl() {
    const ctx = this.ctx;
    await ctx.render('/pay/index.ejs', {
        data: {
            openid:'12312'
        },
    });
  }

  async getPrePaidId() {
    // console.log(111111)
    const ctx = this.ctx;
    ctx.status = 200;

    const inputParams = this.ctx.query;
    //  console.log('-----------------------------------------------------------------------------');

    // console.log(JSON.stringify(this.ctx.request));
    //商户id
    let appId = 'wxd94b4664459cb6e0';
    let mchkey = '228d4b97fd88f28ea5cb8b2ea9a9ad15';
    let mch_id = 1500842181;
    let nonce_str = "SJDHSJDFjhjkewe1";
    let openid = 'oyLgv1uXdzDWJ5PvuEBmB82R7JXA'
    let body = '叮当支付';
    let out_trade_no = "asffwfqw32asfwe2";
    let total_fee = payUtil.getmoney(inputParams.money);
    let spbill_create_ip = '192.168.1.15';
    let notify_url = 'http://dingdangchaxun.cn/notifyUrl';
    let trade_type = 'JSAPI';
    const paySign = payUtil.paysignjsapi (appId, body, mch_id, nonce_str, openid,notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey);

    // let formData  = "<xml>";
    //     formData  += "<appid>"+appId+"</appid>";  //appid
    //     formData  += "<body>"+body+"</body>";
    //     formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号
    //     formData  += "<nonce_str>"+nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
    //     formData  += "<notify_url>"+notify_url+"</notify_url>";
    //     formData  += "<openid>"+openid+"</openid>";
    //     formData  += "<out_trade_no>"+out_trade_no+"</out_trade_no>";
    //     formData  += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
    //     formData  += "<total_fee>"+total_fee+"</total_fee>";
    //     formData  += "<trade_type>"+trade_type+"</trade_type>";
    //     formData  += "<sign>"+paySign+"</sign>";
    //     formData  += "</xml>";
    // const paySign = payUtil.paysignjsapi(appId,nonce_str,notify_url.out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);

//组装xml数据
{/* <xml>
   <appid>wx2421b1c4370ec43b</appid>
   <attach>支付测试</attach>
   <body>JSAPI支付测试</body>
   <mch_id>10000100</mch_id>
   <detail><![CDATA[{ "goods_detail":[ { "goods_id":"iphone6s_16G", "wxpay_goods_id":"1001", "goods_name":"iPhone6s 16G", "quantity":1, "price":528800, "goods_category":"123456", "body":"苹果手机" }, { "goods_id":"iphone6s_32G", "wxpay_goods_id":"1002", "goods_name":"iPhone6s 32G", "quantity":1, "price":608800, "goods_category":"123789", "body":"苹果手机" } ] }]]></detail>
   <nonce_str>1add1a30ac87aa2db72f57a2375d8fec</nonce_str>
   <notify_url>http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php</notify_url>
   <openid>oUpF8uMuAJO_M2pxb1Q9zNjWeS6o</openid>
   <out_trade_no>1415659990</out_trade_no>
   <spbill_create_ip>14.23.150.211</spbill_create_ip>
   <total_fee>1</total_fee>
   <trade_type>JSAPI</trade_type>
   <sign>0CB01533B8C1EF103065174F50BCA001</sign>
</xml> */}

            // appid=wxd94b4664459cb6e0&
            // body=叮当支付&
            // mch_id=1500842181&
            // nonce_str=swjw0i4xwslkyw9&
            // notify_url=http://dingdangchaxun.cn/notifyUrl&
            // openid=WCRQWDQWDQWDQRQWE&
            // out_trade_no=1535553524051&
            // spbill_create_ip=192.168.1.15&
            // total_fee=5000&
            // trade_type=JSAPI&
            // key=228d4b97fd88f28ea5cb8b2ea9a9ad15
    // let formData  = "<xml>";
    //     formData  += "<appid>"+appId+"</appid>";  //appid
    //     formData  += "<body>"+body+"</body>";
    //     formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号
    //     formData  += "<nonce_str>"+nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
    //     formData  += "<notify_url>"+notify_url+"</notify_url>";
    //     formData  += "<openid>"+openid+"</openid>";
    //     formData  += "<out_trade_no>"+out_trade_no+"</out_trade_no>";
    //     formData  += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
    //     formData  += "<total_fee>"+total_fee+"</total_fee>";
    //     formData  += "<trade_type>"+trade_type+"</trade_type>";
    //     formData  += "<sign>"+paySign+"</sign>";
    //     formData  += "</xml>";
        let formData  = "<xml>";
        formData  += "<appid><![CDATA["+ appId +"]]></appid>";  //appid
        formData  += "<body><![CDATA["+body+"]]></body>";
        formData  += "<mch_id><![CDATA["+mch_id+"]]></mch_id>";
        formData  += "<nonce_str><![CDATA["+nonce_str+"]]></nonce_str>";
        formData  += "<notify_url><![CDATA["+notify_url+"]]></notify_url>";
        formData  += "<openid><![CDATA["+openid+"]]></openid>";
        formData  += "<out_trade_no><![CDATA["+out_trade_no+"]]></out_trade_no>";
        formData  += "<spbill_create_ip><![CDATA["+spbill_create_ip+"]]></spbill_create_ip>";
        formData  += "<total_fee><![CDATA["+total_fee+"]]></total_fee>"; 
        formData  += "<trade_type><![CDATA["+trade_type+"]]></trade_type>";
        formData  += "<sign_type><![CDATA["+"MD5"+"]]></sign_type>";
        formData  += "<sign>"+paySign+"</sign>";
        formData  += "</xml>";

        let interfaces = require('os').networkInterfaces();
    　　for (var devName in interfaces) {
    　　　　var iface = interfaces[devName];
    　　　　　　for (var i = 0; i < iface.length; i++) {
    　　　　　　　　let alias = iface[i];
    　　　　　　　　if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
    　　　　　　　　　　console.log(alias.address);
    　　　　　　　　}
    　　　　　　}
    　　}

        console.log(formData);
    //     <xml>
	// <appid><![CDATA[wxd94b4664459cb6e0]]></appid>
	// <body><![CDATA[叮当支付]]></body>
	// <mch_id><![CDATA[1500842181]]></mch_id>
	// <nonce_str><![CDATA[qpvv1idak0tz9pk]]></nonce_str>
	// <notify_url><![CDATA[http://dingdangchaxun.cn/notifyUrl]]></notify_url>
	// <openid><![CDATA[WCRQWDQWDQWDQRQWE]]></openid>
	// <out_trade_no><![CDATA[1535554386704]]></out_trade_no>
	// <spbill_create_ip><![CDATA[192.168.1.15]]></spbill_create_ip>
	// <total_fee><![CDATA[50000]]></total_fee>
	// <trade_type><![CDATA[JSAPI]]></trade_type>
	// <sign>43E7B221D65BE8367EFF7F696B7F9891</sign>
// </xml>

    // console.log('-----------------------------------------------------------------------------');
    console.log("签名=",paySign);

    // const paySign = payUtil.paysignjsapi(appId,nonce_str,notify_url.out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);
    

    const result = await ctx.curl('https://api.mch.weixin.qq.com/pay/unifiedorder', {
        method: 'POST',
        contentType: 'json',
        data: formData,
        dataType: 'text',
    });
console.log('-----------------------------------------------------------------------------');
    console.log(JSON.stringify(result));

    // ctx.body = {
    //     appId:'wxd94b4664459cb6e0',
    //     nonceStr:payUtil.createNonceStr,
    //     signType:'MD5',
    //     paySign: paySign  //签名;
    //     package:    //预付订单id

    // };
  }
}

module.exports = PayController;
