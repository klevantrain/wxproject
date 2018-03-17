'use strict';

const request = require('request');
const config = require('../common/config');
const baseSend = require('../common/send');

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


  async queryApple(key,ctx,type,responseMes,requests){
    let url = '';
    const appKey = "eb7b94e4ca2da62a";
    if(type == "IMEI"){
        url = 'http://api.3023.com/long/apple?app=coverage&key='+ appKey + '&sn=' + key ;
    }else if(type == "ID"){
      url = 'http://api.3023.com/long/apple?app=fmi&key='+ appKey + '&sn=' + key ;
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
    }
    const result = await ctx.curl(url, {
      // data: {key : '6d278cde16510d142a8f7667a4792a28',},
      dataType: 'json',
      headers: {
        'key': '6d278cde16510d142a8f7667a4792a28',
      },
    });
    // console.log(JSON.stringify(result));
    if(result.data.code!=0&&result.data.message!=''){
        responseMes.content = result.data.message + ' ,请输入正确的序列号或者IMEI！';
        return baseSend.sendQueryError(responseMes);
      }else if(result.data.code == 0){
        responseMes.type = type;
        responseMes.key = key;
        responseMes.querys = result.data.data;

        //修改余额
        ctx.service.auth.updateBlanace(requests,type)
        return baseSend.sendQuerySuccess(responseMes);
    }

    // responseMes.type = type;
    // responseMes.key = key;
    // responseMes.querys = result.data.data;
    // // return baseSend.sendQuerySuccess(responseMes);
    // return baseSend.sendQuerySuccess(responseMes);




  }



}
module.exports = BaseController;
