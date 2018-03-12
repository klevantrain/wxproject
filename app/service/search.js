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
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return users;
  }
  async createSearchLog(params) {
    const row = {
      wx_id: params.wx_id,
      user_name: params.name,
      search_keywords: params.key,
      gmt_create: this.app.mysql.literals.now,
      gmt_modified: this.app.mysql.literals.now,
      status: 0,
    };
    console.log(JSON.stringify(row));
    const result = await this.app.mysql.insert('user_log', row); // 更新 user_info 表中的记录
    const insertSuccess = result.affectedRows === 1;
    return insertSuccess;
  }
}

module.exports = SearchService;
