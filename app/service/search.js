'use strict';

const Service = require('egg').Service;

class SearchService extends Service {

  async getSearchLog(params) {
    const query = {};
    if (params.id !== undefined && params.id !== null && params.id !== ''){
      query.id = params.id;
    }
    if ( params.name !== undefined && params.name !== "NULL" && params.name!=="" && params.name !== null){
      query.user_name = params.name;
    }
    if ( params.wxId !== undefined && params.wxId !== "NULL" && params.wxId!=="" && params.wxId !== null){
      query.wx_id = params.wxId;
    }
    query.status = 0;
    const users = await this.app.mysql.select('user_log', {
      where: query, // WHERE 条件
      columns: [ 'id', 'wx_id', 'gmt_create', 'user_name', 'status', 'search_keywords' ], // 要查询的表字段
      orders: [['gmt_create','desc']],
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return users;
  }
  async createSearchLog(params) {
    let userName = params.name;
    // const ranges = [
    //     '\ud83c[\udf00-\udfff]',
    //     '\ud83d[\udc00-\ude4f]',
    //     '\ud83d[\ude80-\udeff]'
    //     ];
    // userName = userName.replace(new RegExp(ranges.join('|'), 'g'), '');
    userName = userName.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "");

    const row = {
      wx_id: params.wx_id,
      user_name: userName,
      search_keywords: params.key,
      gmt_create: this.app.mysql.literals.now,
      gmt_modified: this.app.mysql.literals.now,
      status: 0,
    };
    // console.log(JSON.stringify(row));
    const result = await this.app.mysql.insert('user_log', row); // 更新 user_info 表中的记录
    const insertSuccess = result.affectedRows === 1;
    return insertSuccess;
  }
}

module.exports = SearchService;
