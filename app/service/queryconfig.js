'use strict';

const Service = require('egg').Service;
const baseConfig = require('../common/config');
class QueryConfigService extends Service {

  async setQueryConfig(wx_id, data) {
    const users = await this.app.mysql.select('query_config', { // 搜索 post 表
      where: { wx_id: wx_id, status: 0 }, // WHERE 条件
      columns: [ 'id' ,'wx_id','set_time', 'default_query', 'set_query'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    //不存在，就新增
    data.type = baseConfig.numberToCode[data.type];
    if(users == null || users[0] == null){
      let userName = data.name;
      // const ranges = [
      //     '\ud83c[\udf00-\udfff]',
      //     '\ud83d[\udc00-\ude4f]',
      //     '\ud83d[\ude80-\udeff]'
      //     ];
      userName = userName.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "");
      const row = {
        wx_id: wx_id,
        default_query: data.type,
        set_query: data.type,
        user_name: userName,
        imei_times: 3,
        id_times: 1,
        id_black_white: 1,
        gmt_create: this.app.mysql.literals.now,
        gmt_modified: this.app.mysql.literals.now,
        set_time: this.app.mysql.literals.now,
        status: 0,
      };
      const result = await this.app.mysql.insert('query_config', row); // 更新 user_info 表中的记录
      const insertSuccess = result.affectedRows === 1;
      return insertSuccess;
    }else{
      //更新用户信息
      const rows = {
        id: users[0].id,
        default_query: data.type,
        set_query: data.type,
        set_time: this.app.mysql.literals.now,
      };
      const result = await this.app.mysql.update('query_config', rows); // 更新 user_info 表中的记录

    }
    // return users;
  }
  async getQueryConfig(wx_id) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryConfig = await this.app.mysql.select('query_config', { // 搜索 post 表
      where: { wx_id: wx_id, status: 0 }, // WHERE 条件
      columns: [ 'id' ,'wx_id','set_time', 'default_query', 'set_query'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    if(queryConfig !=null && queryConfig[0]!=null){
      const setTime = queryConfig[0].set_time.getTime();
      const nowTime = new Date().getTime();
      // console.log("setTime==" + setTime);
      // console.log("nowTime==" + nowTime);
      const diffTime = (parseInt(nowTime) - parseInt(setTime))/60000;
      // console.log("diffTime==" + diffTime);
      if(parseInt(diffTime) < 10){
        return queryConfig[0].set_query;
      }else{
        return queryConfig[0].default_query;
      }
    }
    return false;
  }

  async getAllConfigsByWxId(wx_id) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const queryConfig = await this.app.mysql.select('query_config', { // 搜索 post 表
      where: { wx_id: wx_id, status: 0 }, // WHERE 条件
      columns: [ 'id' ,'wx_id','set_time', 'default_query', 'set_query','imei_times','id_times','id_black_white'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    // console.log(JSON.stringify(queryConfig));
    if(queryConfig !=null && queryConfig[0]!=null){
      return queryConfig[0];
    }
    return false;
  }
  // 插入，如果已经有了就更新
  async insertQueryConfig(wx_id, name,type) {
    const users = await this.app.mysql.select('query_config', { // 搜索 post 表
      where: { wx_id: wx_id, status: 0 }, // WHERE 条件
      columns: [ 'id'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    //不存在，就新增
    if(users == null || users[0] == null){
      let userName = name;
      // const ranges = [
      //     '\ud83c[\udf00-\udfff]',
      //     '\ud83d[\udc00-\ude4f]',
      //     '\ud83d[\ude80-\udeff]'
      //     ];
      // userName = userName.replace(new RegExp(ranges.join('|'), 'g'), '');
      userName = userName.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "");

      const row = {
        wx_id: wx_id,
        default_query: type,
        set_query: type,
        user_name: userName,
        imei_times: 3,
        id_times: 1,
        id_black_white: 1,
        gmt_create: this.app.mysql.literals.now,
        gmt_modified: this.app.mysql.literals.now,
        set_time: this.app.mysql.literals.now,
        status: 0,
      };
      const result = await this.app.mysql.insert('query_config', row); // 更新 user_info 表中的记录
      const insertSuccess = result.affectedRows === 1;
      return insertSuccess;
    }else{
      //更新用户信息
      const rows = {
        id: users[0].id,
        set_query: type,
        set_time: this.app.mysql.literals.now,
      };
      const result = await this.app.mysql.update('query_config', rows); // 更新 user_info 表中的记录

    }


    return users;
  }

  async getQueryPrice(type) {
    const queryPrice = await this.app.mysql.select('query_price_config', { // 搜索 post 表
      where: { type: type,status: 0 }, // WHERE 条件
      columns: [ 'price' ,'type'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    // console.log(JSON.stringify(queryPrice));
    return queryPrice[0].price;
  }
  async updateQueryConfig(params) {
    const query = {};
    if (params.id === undefined || params.id === null || params.id === ''){
      return;
    }
    await this.app.mysql.update('query_config', params);
  }

  async updateDefaultQueryTimes(){
    const results = await this.app.mysql.query('update query_config set imei_times =  ? ,id_times=?  ,id_black_white = ? where status = ?', [3, 1,1,0]);
  }
  async getQueryList() {
    const queryPrice = await this.app.mysql.select('query_price_config', { // 搜索 post 表
      where: { status: 0 }, // WHERE 条件
      columns: [ 'id','price' ,'type_name','type'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return queryPrice;
  }
  async updateQueryConfigPrice(params) {
    const query = {};
    if (params.id === undefined || params.id === null || params.id === ''){
      return false;
    }
    await this.app.mysql.update('query_price_config', params);
    return true;
  }
}

module.exports = QueryConfigService;
