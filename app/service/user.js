'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async createUser(params){
    let userName = params.nickName;
    // const ranges = [
    //     '\ud83c[\udf00-\udfff]',
    //     '\ud83d[\udc00-\ude4f]',
    //     '\ud83d[\ude80-\udeff]'
    //     ];
    // userName = userName.replace(new RegExp(ranges.join('|'), 'g'), '');
    userName = userName.replace(/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g, "");

    const row = {
      wx_id: params.FromUserName,
      balance: 10,
      user_level: 0,
      user_name: userName,
      gmt_create: this.app.mysql.literals.now,
      gmt_modified: this.app.mysql.literals.now,
      status: 0,
    };

    const result = await this.app.mysql.insert('user_info', row); // 更新 user_info 表中的记录
    const insertSuccess = result.affectedRows === 1;
    return insertSuccess;
  }
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
    query.status = 0;
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
  async managerUserBlance(params, userId) {
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

  async deleteWxUser(params) {
    const users = await this.app.mysql.select('user_info', {
      where: { wx_id: params.FromUserName, status: 0 }, // WHERE 条件
      columns: [ 'id', 'user_name', 'wx_id', 'status', 'user_level', 'balance' ], // 要查询的表字段
      limit: 10000, // 返回数据量
      offset: 0, // 数据偏移量
    });
    // console.log(JSON.stringify(users));

    if(users!=null && users[0]!=null){
      // console.log(JSON.stringify(users[0]));
      const row = {
        id: users[0].id,
        status: -1,
      };
      const result = await this.app.mysql.update('user_info', row); // 更新 user_info 表中的记录
      // 判断更新成功
      const updateSuccess = result.affectedRows === 1;
      return updateSuccess;
    }
  }


}

module.exports = UserService;
