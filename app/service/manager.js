'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async find(uid) {
    console.log(uid)
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.app.mysql.get('manager_info', { id: uid });
    return  user ;
  }

  async getManageInfo(params) {
    const query = {};
    if (params.id !== undefined && params.id !== null && params.id !== ''){
      query.id = params.id;
    }
    if ( params.name !== undefined && params.name !== "NULL" && params.name!=="" && params.name !== null){
      query.user_name = params.name;
    }
    query.status = 0;
    console.log(query);
    const users = await this.app.mysql.select('manager_info', {
      where: query, // WHERE 条件
      columns: [ 'id', 'user_name', 'status', 'user_level', 'balance', 'password' ], // 要查询的表字段
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return users;
  }
  async updateManage(params) {
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
      user_level:params.level,
      user_name:params.name,
      password:params.password
    };
    console.log(row);
    const result = await this.app.mysql.update('manager_info', row); // 更新 user_info 表中的记录
    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    console.log(updateSuccess);

    return updateSuccess;
  }
  async deleteManageInfo(params) {
    const query = {};
    if (params.id === undefined || params.id === null || params.id === ''){
      return;
    }
    const row = {
      id: params.id,
      status: -1,
    };
    console.log(row)
    const result = await this.app.mysql.update('manager_info', row); // 更新 user_info 表中的记录
    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;
    console.log(updateSuccess);

    return updateSuccess;
  }


  async managerAdd(params) {
    const row = {
      balance: params.balance,
      user_level: params.level,
      user_name: params.userName,
      password: params.passWord,
      gmt_create: this.app.mysql.literals.now,
      gmt_modified: this.app.mysql.literals.now,
      status: 0
    };

    const result = await this.app.mysql.insert('manager_info', row); // 更新 user_info 表中的记录
    const insertSuccess = result.affectedRows === 1;
    console.log(row);
    return insertSuccess;
  }



}

module.exports = UserService;
