'use strict';

const request = require('request');
const config = require('../common/config');
const baseSend = require('../common/send');
const queryBuilds = require('../common/queryBuild');

const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }
  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
  send(data){
    return baseSend.send(data);
  }
  sendMyInfo(data,userInfo,baseConfig,queryConfig){
    return baseSend.sendMyInfo(data,userInfo,baseConfig,queryConfig);
  }
  sendSetDefaultQueryMes(data,queryConfig){
    return baseSend.sendSetDefaultQueryMes(data,queryConfig);
  }
  sendSetDefaultQueryErrorMes(data,queryConfig){
    return baseSend.sendSetDefaultQueryErrorMes(data,queryConfig);
  }
  sendBalanceLow(requests,judge){
    return baseSend.sendBalanceLow(requests,judge);
  }
  sendQuerySuccess(requests,data){
    return baseSend.sendQuerySuccess(requests,data);
  }
  async sendAsysMessage(ctx,token,toUserId,data){
    const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token, {

      method: 'POST',
      contentType: 'json',
      data: {
              touser:toUserId,
              msgtype:"text",
              text:
              {
                "content":data,
              },
            },
      dataType: 'json',
    });
    // console.log("----==="+JSON.stringify(result));
  }


  async getAccessToken(ctx){
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret='+config.AppSecret ;
    const result = await ctx.curl(url, {
      dataType: 'json',
    });
    // console.log("token=="+JSON.stringify(result));
    return result.data;
  }
  async getWxUserInfo(access_token, openId,ctx) {
    // const ctx = this.ctx;
    const url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openId + '&lang=zh_CN';
    const result = await ctx.curl(url, {
      dataType: 'json',
    });
    // console.log("token=="+JSON.stringify(result))
    return result.data;
  }

  async valiadSN(ctx,key) {
    const url = 'http://api.3023data.com/apple/validate?sn=' + key;
    const result = await ctx.curl(url, {
      dataType: 'json',
      headers: {
        'key': '6d278cde16510d142a8f7667a4792a28',
      },
    });
    // console.log(JSON.stringify(result));
    if(result.data.code!=0){
      return false;
    }
    return true;
  }


  async queryApple(token,key,ctx,type,responseMes,requests){
    const queryBuild = queryBuilds.buildQueryValue(key,type);
    let returnValue = '';
    // const responseMes = {};
    if(queryBuild.code == 200){
        const keys = queryBuild.keys;
        if(keys.length == 1){
          returnValue = await this.dealManyQuerys(keys[0],ctx,type,responseMes,requests);
        }else {
          for(let i=0; i<keys.length;i++){
             const values = await this.dealManyQuerys(keys[i],ctx,type,responseMes,requests);
             returnValue = returnValue + "\n" + "---------- "+  (parseInt(i)+1) + " ---------- " +"\n" + values;
          }
        }
        responseMes.content = returnValue;
        // console.log("数据拼requests装结果："+returnValue);
        this.sendAsysMessage(ctx,token,requests.FromUserName,returnValue);
        return;
        // return baseSend.sendQuerySuccess(requests,returnValue);
    }else{

    }
    this.sendAsysMessage(ctx,token,requests.FromUserName,returnValue);

    // return baseSend.sendQuerySuccess(returnValue);

  }

  // async test(){
  //   return "-asdagasd测试是是是是是死是活";
  // }
  async dealManyQuerys(key,ctx,type,responseMes,requests){


    // console.log(JSON.stringify(requests));
    // const resMsg = '<xml>' +
    //    '<ToUserName><![CDATA[' + requests.FromUserName + ']]></ToUserName>' +
    //    '<FromUserName><![CDATA[' + requests.ToUserName + ']]></FromUserName>' +
    //    '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
    //    '<MsgType><![CDATA[text]]></MsgType>' +
    //    '<Content><![CDATA[' +  key +']]></Content>' +
    //    '</xml>';
    // return resMsg;


    let url = '';
    const appKey = "eb7b94e4ca2da62a";
    if(type == "IMEI"){
      url = 'http://api.3023data.com/apple/coverage?sn=' + key ;
    }else if(type == "ID"){
      url = 'http://api.3023data.com/apple/activationlock?sn=' + key ;
    }else if(type == "SN_TO_IMEI"){
      url = 'http://api.3023.com/long/apple?app=sntoimei&key='+ appKey + '&sn=' + key ;
    }else if(type == "IS_REPAIR"){
      url = 'https://api.3023.com/apple/repair?sn=' + key ;
    }
    else if(type == "REPAIR_PROGRESS"){
      const arrs = key.split(" ");
      url = 'https://api.3023.com/apple/repair?app=details&sn=' + arrs[0] +'&id='+ arrs[1];
    }else if(type == "ID_BLACK_WHITE"){
      url = 'https://api.3023.com/apple/icloud?sn=' + key ;
    }else if(type == "NET_LOCK"){
      url = 'https://api.3023.com/apple/simlock?sn=' + key ;
    }else if(type == "NEXT_QUERY"){
      const vaild = await this.valiadSN(ctx,key);
      // console.log("验证结果" )
      if(vaild == false){
        responseMes.content = '请输入正确的序列号或者IMEI！';
        return baseSend.sendQueryError(responseMes);
      }
      url = 'http://api.3023data.com/apple/carrier?sn=' + key ;

    }else if(type == "QUERY_COUNTRY_SELLER"){
      url = 'http://api.3023data.com/apple/mpn?sn=' + key ;
    }

    let result = '';
    if(type == "NEXT_QUERY"){
      // const _this  = this;
      const nowDate = new   Date();
      const start = nowDate.getTime();
      result =  await this.query(ctx,url)
      // console.log("等待了三秒123");
      while(true){
        if(new   Date().getTime()-start> 10000){
          break;
        }
      }
      // console.log("等待了三秒321");
      result =  await this.query(ctx,url)

      // await  setTimeout(function(){result =  _this.query(ctx,url)},3000);
    }else{
      result = await this.query(ctx,url);
    }
    // result = await ctx.curl(url, {
    //   dataType: 'json',
    //   headers: {
    //     'key': '6d278cde16510d142a8f7667a4792a28',
    //   },
    // });
    // console.log(result);
    if(result.data.code!=0 && result.data.message!=''){
        responseMes.content = result.data.message + ' ,请输入正确的序列号或者IMEI！';
        return baseSend.sendQueryError(responseMes);
      }else if(result.data.code == 0){
        responseMes.type = type;
        responseMes.key = key;
        responseMes.querys = result.data;
        //修改余额
        ctx.service.auth.updateBlanace(requests,type)
        return baseSend.buildSuccessContent(responseMes);
    }
  }
  async  query(ctx,url){
    const  result = await ctx.curl(url, {
        dataType: 'json',
        headers: {
          'key': '6d278cde16510d142a8f7667a4792a28',
        },
      });
    return result;
  }


}
module.exports = BaseController;
