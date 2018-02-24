'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
  async logined(uid) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.app.mysql.get('manager_info', { id: uid });
    return { user };
  }
  async getLoginInfo(userName, passwords) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const users = await this.app.mysql.select('manager_info', { // 搜索 post 表
      where: { user_name: userName, password: passwords,status: 0 }, // WHERE 条件
      columns: [ 'id' ,'user_level','user_name'], // 要查询的表字段
      limit: 100, // 返回数据量
      offset: 0, // 数据偏移量
    });
    return users;
  }

}

module.exports = LoginService;
