'use strict';

const Controller = require('../core/base_controller');
const baseConfig = require('../common/config');
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
    if (code === signature){
       // ctx.body = 'success';
       // ctx.body = echostr;
      await this.dealRequest(ctx).then(function(result){
        // console.log("====="+result);
        ctx.body = result;
      });
    } else {
        ctx.body = 'error';
    }
  }

  async dealRequest(ctx) {

    // const ctx = this.ctx;
    const requests = ctx.request.body;
    const _this = this;
    let resulBody = '';
    let token = '';
    await _this.getAccessToken(ctx).then(function (result){
          token = result.access_token;
    });
    const wxInfo = await _this.getWxUserInfo(token, requests.FromUserName,ctx);
    if(token == '' || wxInfo.errcode!=undefined){
      console.log("服务器内部错误");
      return;
    }
    //创建用户
    if (requests != null && requests.Event === 'subscribe'){
      // console.log("订阅处理"+result2.nickname);
      requests.nickName = wxInfo.nickname;
      ctx.service.user.createUser(requests);
      ctx.service.queryconfig.insertQueryConfig(wxInfo.openid,wxInfo.nickname,"IMEI");
    }
    //删除用户
    if (requests != null && requests.Event === 'unsubscribe'){
      ctx.service.user.deleteWxUser(requests).then(function (result3){
        if(result3 === true){
            console.log("删除成功");
        }
      });
    }
    const responseMes = {
       fromusername : requests.FromUserName,
       tousername   : requests.ToUserName,
    }
    //点击事件
    const filter = requests.EventKey != "MY_INFORMATION"
          &&  requests.EventKey !="CUSTOMER_SERVICE" &&  requests.EventKey !="INSTRUCTIONS";
    if(requests != null && requests.Event === 'CLICK'){
      if(filter){
        ctx.service.queryconfig.insertQueryConfig(requests.FromUserName,wxInfo.nickname,requests.EventKey);
      }
      if (requests.EventKey === "IMEI" ){
        responseMes.content = 'IMEI/序列号查询';
      }else if(requests.EventKey === "ID" ){
        responseMes.content = 'ID激活锁查询';
      }else if(requests.EventKey === "IS_REPAIR" ){
        responseMes.content = '查是否正在保修';
      }else if(requests.EventKey === "REPAIR_PROGRESS" ){
        responseMes.content = '维修进度查询';
      }else if(requests.EventKey === "WIFI" ){
        responseMes.content = 'Wifi蓝牙码查询';
      }else if(requests.EventKey === "ID_BLACK_WHITE" ){
        responseMes.content = 'ID黑白查询';
      }else if(requests.EventKey === "SN_TO_IMEI" ){
        responseMes.content = '序列号查IMEI';
      }else if(requests.EventKey === "NET_LOCK" ){
        responseMes.content = '网络锁查询';
      }else if(requests.EventKey === "NEXT_QUERY" ){
        responseMes.content = '下次策略查询';
      }else if(requests.EventKey === "QUERY_COUNTRY_SELLER" ){
        responseMes.content = '查国家/销售人';
      }else if(requests.EventKey === "DEFAULT_QUERY_SET" ){
        responseMes.content =
                   '请输入默认查询编号：'+ '\n' +
                   '0: 取消默认查询' + '\n' +
                   '1: IMEI/序列号查询' + '\n' +
                   '2: ID激活锁查询'  + '\n' +
                   '3: 查看是否正在保修'  + '\n' +
                   '4: 维修进度查询'  + '\n' +
                   '5: WIFI蓝牙码查询'  + '\n' +
                   '6: ID黑白查询' + '\n' +
                   '7: 序列号查IMEI' + '\n' +
                   '8: 查国家/销售人' + '\n' +
                   '9: 网络锁查询'  ;
      }else if(requests.EventKey === "MY_INFORMATION" ){
        const params = {
          wxId : requests.FromUserName,
        }
        const userInfo = await ctx.service.user.find(params);
        const queryConfig = await ctx.service.queryconfig.getAllConfigsByWxId(requests.FromUserName);
        resulBody = _this.sendMyInfo(responseMes,userInfo,baseConfig,queryConfig);

        // console.log(resulBody);
      }else {
        responseMes.content = '公众号内部服务器错误';
      }

      if(requests.EventKey != "MY_INFORMATION"){
          //判断余额，余额充足的情况允许查询，否则提示余额不足
          const judge = await ctx.service.auth.judgeBlanace(requests);
          if(judge!=null && judge !=''&& judge.allow == true){
            resulBody = _this.send(responseMes);
          }else{
            resulBody = _this.sendBalanceLow(requests,judge);
          }
      }
   }else if(requests != null && requests.MsgType === 'text'){
     // console.log("requests=="+JSON.stringify(requests));
     const queryKey = requests.Content;
     const queryConfig = await ctx.service.queryconfig.getQueryConfig(requests.FromUserName);
     // console.log("queryConfig=="+JSON.stringify(queryConfig));
     if(queryConfig === "DEFAULT_QUERY_SET"){
       const data = {
         name:  wxInfo.nickname,
         type:  queryKey,
       }
       const reg=/^[0-9]*$/;
       if(!reg.test(queryKey) || parseInt(queryKey)>9 ){
         // console.log(11111)
         resulBody = _this.sendSetDefaultQueryErrorMes(requests,"请输入0到9的整数");
       }else{
         resulBody = _this.sendSetDefaultQueryMes(requests,baseConfig.numberToCode[queryKey]);
         ctx.service.queryconfig.setQueryConfig(requests.FromUserName,data);
       }
     }else{
       resulBody = _this.queryApple(queryKey,ctx,queryConfig,responseMes,requests);
       //查询历史记录
       // console.log("wxInfo"+JSON.stringify(wxInfo))
       const userLogParam = {
          wx_id: requests.FromUserName,
          name: wxInfo.nickname,
          key: baseConfig.typeEnumnName[queryConfig],
        }
        ctx.service.search.createSearchLog(userLogParam);
       }
   }
    return resulBody;
  }

}

module.exports = AuthController;
