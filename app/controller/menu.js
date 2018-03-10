'use strict';

const Controller = require('../core/base_controller');


class MenuController extends Controller {
  async createMenu() {
    const ctx = this.ctx;
    ctx.body = "123123";
    this.getAccessToken().then(function (result){
      const createResult = ctx.curl('https://api.weixin.qq.com/cgi-bin/menu/create?access_token=' + result.access_token, {
        // 必须指定 method
        method: 'POST',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        data: {
          "button": [
              {
                  "name": "查询",
                  "sub_button": [
                      {
                          "type": "click",
                          "name": "IMEI/序列号查询",
                          "key": "IMEI",
                          "sub_button": [ ]
                      },
                      {
                          "type": "click",
                          "name": "ID激活锁查询",
                          "key": "ID",
                          "sub_button": [ ]
                      },
                      {
                          "type": "click",
                          "name": "查是否正在维修",
                          "key": "IS_REPAIR",
                          "sub_button": [ ]
                      },
                      {
                          "type": "click",
                          "name": "维修进度查询",
                          "key": "REPAIR_PROGRESS",
                          "sub_button": [ ]
                      },
                      {
                          "type": "click",
                          "name": "wifi蓝牙码查询",
                          "key": "WIFI",
                          "sub_button": [ ]
                      },

                  ]
              },
              {
                  "name": "积分查询",
                  "sub_button": [
                      {
                          "type": "pic_sysphoto",
                          "name": "ID黑白查询",
                          "key": "rselfmenu_1_0",
                         "sub_button": [ ]
                       },
                  ]
              },

                {  "name": "我的信息",
                  "sub_button": [
                      {
                          "type": "click",
                          "name": "我的信息",
                          "key": "rselfmenu_1_0",
                         "sub_button": [ ]
                       },

                  ]
              },

          ]
      },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });
      ctx.body = createResult.data;


    });


  }
}

module.exports = MenuController;
