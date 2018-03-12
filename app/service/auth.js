'use strict';

const Service = require('egg').Service;
const baseConfig = require('../common/config');

class AuthService extends Service {
  async delClick(requests,responseMes,_this) {

  }

  async judgeBlanace(requests) {
    const ctx = this.ctx;
    // const userInfo = await ctx.service.user.find({wxId : requests.FromUserName}});
    const price = await ctx.service.queryconfig.getQueryPrice(requests.EventKey);
    const params = {
      wxId : requests.FromUserName,
    }
    const userInfo = await ctx.service.user.find(params);
    const balance = userInfo[0].balance;
    const configResult  = await ctx.service.queryconfig.getAllConfigsByWxId(requests.FromUserName);
    const result = {
      allow:  false,
    }

    if(requests.EventKey == "IMEI"){
        const imeiTimes = configResult.imei_times;
        if(parseInt(imeiTimes)>0 || parseInt(balance)>=parseInt(price)){
          result.allow = true;
        }
    }else if(requests.EventKey == "ID" ){
        const idTimes = configResult.id_times;
        if(parseInt(idTimes)>0 || parseInt(balance)>=parseInt(price)){
          result.allow = true;
        }
    }else if(requests.EventKey == "ID_BLACK_WHITE"){
      const idBlackTimes = configResult.id_black_white;
      if(parseInt(idBlackTimes)>0 || parseInt(balance)>=parseInt(price)){
        result.allow = true;
      }
    }
    if(parseInt(balance) >= parseInt(price)){
      result.allow = true;
    }else{
      result.price = price;
      result.balance = balance;
    }

    // if(result.allow == true){
    //   return result;
    // }
    // console.log(JSON.stringify(result));
    return result;
  }

  async updateBlanace(requests,type) {
    // console.log("type=="+type);
    const ctx = this.ctx;
    const params = {
      wxId : requests.FromUserName,
    }
    const userInfo = await ctx.service.user.find(params);
    if(userInfo==null || userInfo[0]==null){
        return false;
    }
    const price = await ctx.service.queryconfig.getQueryPrice(type);
    const configResult  = await ctx.service.queryconfig.getAllConfigsByWxId(requests.FromUserName);

    const updateRow = {};


    if(type == "IMEI"){
        const imeiTimes = configResult.imei_times;
        if(parseInt(imeiTimes)>0){
          updateRow.id = configResult.id;
          updateRow.imei_times = parseInt(imeiTimes) - 1 > 0 ? parseInt(imeiTimes) - 1 : 0;
          ctx.service.queryconfig.updateQueryConfig(updateRow);
        }else{
          updateRow.id =userInfo[0].id;
          updateRow.balance = parseInt(userInfo[0].balance - parseInt(price)) > 0?parseInt(userInfo[0].balance - parseInt(price)):0;
          ctx.service.user.updateUserBalance(updateRow);
        }
    }else if(type == "ID"){
        const idTimes = configResult.id_times;
        if(parseInt(idTimes)>0){
          updateRow.id = configResult.id;
          updateRow.id_times = parseInt(idTimes) - 1 > 0 ? parseInt(imeiTimes) - 1 : 0;
          ctx.service.queryconfig.updateQueryConfig(updateRow);
        }else{
          updateRow.id =userInfo[0].id;
          updateRow.balance = parseInt(userInfo[0].balance - parseInt(price))>0 ? parseInt(userInfo[0].balance - parseInt(price)):0;
          ctx.service.user.updateUserBalance(updateRow);
        }
    }else if(type == "ID_BLACK_WHITE"){
      const idBlackTimes = configResult.id_black_white;
      if(parseInt(idBlackTimes)>0){
        updateRow.id = configResult.id;
        updateRow.id_black_white = parseInt(idBlackTimes) - 1 > 0 ? parseInt(imeiTimes) - 1 : 0;
        ctx.service.queryconfig.updateQueryConfig(updateRow);
      }else{
        updateRow.id =userInfo[0].id;
        updateRow.balance = parseInt(userInfo[0].balance - parseInt(price))>0 ? parseInt(userInfo[0].balance - parseInt(price)):0;
        ctx.service.user.updateUserBalance(updateRow);
      }
    }else{
      updateRow.id =userInfo[0].id;
      updateRow.balance = parseInt(userInfo[0].balance - parseInt(price))>0 ? parseInt(userInfo[0].balance - parseInt(price)):0;
      ctx.service.user.updateUserBalance(updateRow);
    }
  }
}

module.exports = AuthService;
