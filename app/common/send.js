
'use strict';
const config = require('./config');
const baseSend = {
  //回复事件消息
  send(data){
    // console.log(data)
    //tousername  发送者openid
    let content = '<Content><![CDATA[您当前选择的是"'+data.content + '"。请输入序列号或IMEI，批量查询请用空格或换行隔开'+
              '一次最多查询5个(10分钟内有效)]]></Content>';
    if(data.EventKey == "REPAIR_PROGRESS"){
      content = '<Content><![CDATA[您当前选择的是"'+data.content + '"。请输入序列号和苹果的维修ID，'+
                  '中间用空格隔开(10分钟内有效)]]></Content>';
    }else if(data.EventKey =="DEFAULT_QUERY_SET"){
      content = '<Content><![CDATA['+data.content + ']]></Content>';
    }
    // console.log(content);


   const resMsg = '<xml>' +
      '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
      '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
      '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
      '<MsgType><![CDATA[text]]></MsgType>' +content
       +
      '</xml>';
      return resMsg;
  },
  sendViewInfo(data){
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[view]]></MsgType>' +
       '<Content><![CDATA[您当前选择的是"'+data.content + '"。请输入序列号或IMEI，批量查询请用空格或换行隔开'+
                 '一次最多查询5个(10分钟内有效)]]></Content>' +
       '</xml>';
       return resMsg;
  },
  sendQueryError(data){
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA['+data.content+ ']]></Content>' +
       '</xml>';
    return resMsg;
  },
  sendSetDefaultQueryMes(data,queryConfig){
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.FromUserName + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.ToUserName + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA[' + '成功设置默认查询方式为：'+config.typeEnumnName[queryConfig] +']]></Content>' +
       '</xml>';
    return resMsg;
  },
  sendSetDefaultQueryErrorMes(data,content){
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.FromUserName + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.ToUserName + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA[' + content +']]></Content>' +
       '</xml>';
    return resMsg;
  },
  sendMyInfo(data,userInfo,baseConfig,queryConfig){
    const content = '[用户ID]'+ userInfo[0].id+ '\n' +
    '[默认查询方式]' + baseConfig.typeEnumnName[queryConfig.default_query] + '\n' +
    '[IMEI/序列号查询今日免费查询次数]' + queryConfig.imei_times+'/3'+ '\n' +
    '[ID激活锁今日免费查询次数]' + queryConfig.id_times+'/1'+ '\n' +
    '[ID黑白今日免费查询次数]' + queryConfig.id_black_white+'/1'+ '\n' +
    '[当前可用积分]' + userInfo[0].balance + '\n' +
    '[充值请联系客服]'+  "客服名称" ;
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA[' + content +']]></Content>' +
       '</xml>';
    return resMsg;
  },
  sendQuerySuccess(data){
    let content = '';
    if(data.type== "IMEI"){
      const activated = data.querys.activated === true ? "已激活" : "未激活";
      const coverage = data.querys.coverage === "expired" ? "已过保" : data.querys.coverage+"到期，剩余"+data.querys.daysleft;
      const applecare = data.querys.applecare === true? "是": "否";
      const loaner = data.querys.loaner === "Y"? "是": "否";
       content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                  '输入数据：'+ data.key + '\n' +
                  '查询结果：'+ '\n' +
                  '序列号：' +   data.querys.sn + '\n' +
                  '设备名称：' + data.querys.model + '\n' +
                  '设备颜色：' + data.querys.color + '\n' +
                  '设备容量：' + data.querys.capacity + '\n' +
                  '是否激活：' + activated + '\n' +
                  '购买日期：' + data.querys.purchase.date + '\n' +
                  // '电话支持：' + data.querys.capacity + '\n' +
                  '保修状态：' + coverage + '\n' +
                  '借出设备：' + loaner + '\n' +
                  '是否延保：' + applecare ;
    }
    else if(data.type== "ID"){
      const locked = data.querys.locked === "ON" ? "开启" : "关闭";
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                  locked;
    }else if(data.type== "SN_TO_IMEI"){
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                  data.querys;
    }else if(data.type == "IS_REPAIR"){
      let isRepaire = "无维修历史！"
      if(data.querys.status =="once repaired"){
          isRepaire = "曾经有维修历史！"
      }else if(data.querys.status =="under repair	"){
          isRepaire = "正在维修中！"
      }
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                 '手机型号：'+ data.querys.model + '\n' +
                  '维修状态：'+ isRepaire;
    }else if(data.type == "REPAIR_PROGRESS"){
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                 '手机型号：'+ data.querys.product + '\n' +
                 '维修时间：'+ data.querys.time + '\n' +
                  '维修状态：'+ data.querys.status + '\n' +
                  '维修详情：'+ data.querys.description;
    }else if(data.type == "ID_BLACK_WHITE"){
      let idBW = "黑";
      if(data.querys.icloud != "Lost"){
          idBW = "白";
      }
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                 '手机型号：'+ data.querys.model + '\n' +
                 'ID黑白：'+ idBW ;
    }else if(data.type == "NET_LOCK"){
      let isLocked = "有锁";
      if(data.querys.simlock != "locked"){
          isLocked = "无锁";
      }
      content = '查询类型： '+config.typeEnumnName[data.type] + '\n' +
                 '输入数据：'+ data.key + '\n' +
                 '查询结果：'+ '\n' +
                 '手机型号：'+ data.querys.model + '\n' +
                 '网络锁：'+ isLocked ;
    }



    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + data.fromusername + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + data.tousername + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA[' + content +']]></Content>' +
       '</xml>';
    return resMsg;
  },

  sendBalanceLow(requests,judge){
    let content = '';
    const key = requests.EventKey;
    if( key == "IMEI" || key == "ID" || key ==  "ID_BLACK_WHITE"){
        content = '您当前选择的是：'+config.typeEnumnName[key]+ '。今日免费次数已用完，'+ judge.price +'积分查询一次,剩余【'+
                  judge.balance + '】积分。积分不足，建议联系客服充值。'
    }else{
      content = '您当前选择的是：'+config.typeEnumnName[key]+ '。'+ judge.price +'积分一次,剩余【'+
                judge.balance + '】积分。积分不足，建议联系客服充值。'
    }
    const resMsg = '<xml>' +
       '<ToUserName><![CDATA[' + requests.FromUserName + ']]></ToUserName>' +
       '<FromUserName><![CDATA[' + requests.ToUserName + ']]></FromUserName>' +
       '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
       '<MsgType><![CDATA[text]]></MsgType>' +
       '<Content><![CDATA[' + content +']]></Content>' +
       '</xml>';
    return resMsg;
  }

};
module.exports = baseSend;
