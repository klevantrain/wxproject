'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async find(params) {
    console.log(params.id);
    const query = {};
    if (params.id !== undefined && params.id !== null && params.id !== ''){
      query.id = params.id;
    }
    if ( params.name !== undefined && params.name !== "NULL" && params.name!=="" && params.name !== null){
      query.user_name = params.name;
    }
    if (params.wxId !==undefined &&params.wxId !== null&&params.wxId!=""){
      query.wx_id = params.wxId;
    }
    const users = await this.app.mysql.select('user_info', {
      where: query, // WHERE 条件
      columns: [ 'id', 'user_name', 'wx_id', 'status', 'user_level', 'balance' ], // 要查询的表字段
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return users;
  }
  async updateUserBalance(params) {
    const query = {};
    if (params.id === undefined || params.id === null || params.id === ''){
      return;
    }
    if ( params.balance === undefined || params.balance === "NULL" || params.balance==="" || params.name === null){
      return;
    }

    const row = {
      id: params.id,
      balance: params.balance,
    };
    console.log(row);
    const result = await this.app.mysql.update('user_info', row); // 更新 user_info 表中的记录
    console.log(result);

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    console.log(updateSuccess);

    return updateSuccess;
  }
}

module.exports = UserService;
