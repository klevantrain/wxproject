'use strict';

const Service = require('egg').Service;

class PayService extends Service {
  async logined(uid) {
    // 假如 我们拿到用户 id 从数据库获取用户详细信息
    const user = await this.app.mysql.get('manager_info', { id: uid });
    return { user };
  }
  async getPrePaidId(userName, passwords) {
   
        

  }

}

module.exports = PayService;
