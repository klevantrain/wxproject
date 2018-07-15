'use strict';

const Service = require('egg').Service;
const config = require('../common/config');

class ScheduleInfo extends Service {
  async createScheduelInfo(params) {
    const row = {
        wx_id: params.wx_id,
        gmt_create: this.app.mysql.literals.now,
        gmt_modified: this.app.mysql.literals.now,
        status: 0,
        key: params.key,
        type: params.type,
        type_code:params.type_code,
        type_name: params.type_name
      };
  
    const result = await this.app.mysql.insert('schedule_info', row); // 更新 schedule_info 表中的记录    
    // const user = await this.app.mysql.get('schedule_info', { id: uid });
    return { result };
  }
  async getScheduelInfo(params) {
      const queryParams = {};
      if(params.type!=null&&params.type!=""){
        queryParams.type = params.type;
      }
      if(params.status!=null&&params.status!=""){
        queryParams.status = params.status;
      }
      if(params.wx_id!=null&&params.wx_id!=""){
        queryParams.wx_id = params.wx_id;
      }
      if(params.type_code!=null&&params.type_code!=""){
        queryParams.type_code = params.type_code;
      }
      if(params.key!=null&&params.key!=""){
        queryParams.key = params.key;
      }
      console.log("query_param=="+JSON.stringify(queryParams));
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const scheduelInfo = await this.app.mysql.select('schedule_info', { // 搜索 post 表
      where: queryParams, // WHERE 条件
      columns: [ 'id' ,'wx_id','key','type','type_name','status','type_code'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    // console.log("===="+JSON.stringify(scheduelInfo));
    this.ctx.body = scheduelInfo;
    return scheduelInfo;
  }
   //批量更新
  async updateScheduelInfo(params) {
    if (params.id === undefined || params.id === null || params.id === ''){
      return false;
    }
    if ( params.status === undefined || params.status === "NULL" || params.status==="" || params.status === null){
      return false;
    }
    // const row = {
    //   id: params.id,
    //   status: params.status,
    // };
    const results = await this.app.mysql.query('update schedule_info set status = ? where id in (?)', [params.status, params.id]);
    // const result = await this.app.mysql.update('schedule_info', row); // 更新 user_info 表中的记录
    // 判断更新成功
    const updateSuccess = results.affectedRows === 1;

    return updateSuccess;
  }

  async  query(v){
    const ctx = this.ctx;
    const type = v.type_code;
    let url = "";
    if(type == "GSX_STRATEGY_QUERY"){
        url = 'http://api.3023data.com/apple/gsx?image=false&lang=zh&app=policy-premium&sn=' + v.key ;
    }else  if(type == "GSX_CASE_QUERY"){
        url = 'http://api.3023data.com/apple/gsx?app=case-text&sn=' + v.key ;
    }
    let result = '';
    try {
      result = await ctx.curl(url, {
          dataType: 'json',
          timeout: 30000,
          headers: {
            'key': '6d278cde16510d142a8f7667a4792a28',
          },
        });
        console.log("result===="+JSON.stringify(result));
    } catch (err) {
      console.log(err);
      result={
        data:{
          code:5001,
          message:'苹果服务器响应超时，请客官稍后几秒重新提交查询，当前查询不会扣费，请客官放心！'
        }
      }
    }
    return result;
  }
  async sendAsysMessage(v,data){
      console.log("---"+JSON.stringify(data));
    const ctx = this.ctx;
    const token = await this.getAccessToken(ctx);
    const result = await ctx.curl('https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token='+token, {
      method: 'POST',
      contentType: 'json',
      data: {
              touser:v.wx_id,
              msgtype:"text",
              text:
              {
                "content":data,
              },
            },
      dataType: 'json',
    });
    console.log("----==="+JSON.stringify(result));
  }

  async getAccessToken(ctx){
    const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.AppID + '&secret='+config.AppSecret ;
    const result = await ctx.curl(url, {
      dataType: 'json',
    });
    // console.log("token=="+JSON.stringify(result));
    return result.data.access_token;
  }

}

module.exports = ScheduleInfo;
