'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async find(params) {
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
    const result = await this.app.mysql.update('user_info', row); // 更新 user_info 表中的记录

    // 判断更新成功
    const updateSuccess = result.affectedRows === 1;

    return updateSuccess;
  }
  async managerUserBlance(params,userId) {
    /**
    0:参数不合法
    1: 未找到用户
    2：积分余额不足
    **/
    const query = {};
    if (params.wxId === undefined || params.wxId === null || params.wxId === ''){
      return 0;
    }
    query.wx_id = params.wxId;
    if ( params.balance === undefined || params.balance === "NULL" || params.balance==="" || params.name === null){
      return 0;
    }


    //1.先找到对应用户
    const users = await this.app.mysql.select('user_info', {
      where: query, // WHERE 条件
      columns: [ 'id', 'user_name', 'wx_id', 'status', 'user_level', 'balance' ], // 要查询的表字段
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });

    if(users== null || users[0] == null ){
      return 1;
    }
    const oldBlanace = users[0].balance;
    if ( oldBlanace === undefined || oldBlanace === "NULL" || oldBlanace==="" || oldBlanace === null){
      return 1;
    }

    //2.找到管理员，判断积分余额
    const managerInfo = await this.app.mysql.get('manager_info', { id: userId });
    if(managerInfo == null ){
      return 2;
    }
    const managerBalance = managerInfo.balance;
    if(parseInt(managerBalance) < parseInt(params.balance)){
      return 2;
    }
    const managerRow = {
      id: userId,
      balance: parseInt(managerBalance) - parseInt(params.balance),
    };

    const result = await this.app.mysql.update('manager_info', managerRow); // 更新 user_info 表中的记录
    // 判断更新成功
    if(result.affectedRows != 1){
      return 2;
    }

    //3更新用户的积分余额
    const row = {
      id:users[0].id,
      wx_id: params.wxId,
      balance: parseInt(oldBlanace) + parseInt(params.balance),
    };
    const result2 = await this.app.mysql.update('user_info', row); // 更新 user_info 表中的记录

    return result2.affectedRows === 1;
  }
}

module.exports = UserService;
