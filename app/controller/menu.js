'use strict';

const Controller = require('../core/base_controller');


class MenuController extends Controller {
  async createMenu() {
    const ctx = this.ctx;
    // ctx.body = "123123";
    this.getAccessToken(ctx).then(function (result){
      console.log(result)
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
                           "name": "IMEI查序列号",
                           "key": "SN_TO_IMEI",
                          "sub_button": [ ]
                        },
                      // {
                      //     "type": "click",
                      //     "name": "wifi蓝牙码查询",
                      //     "key": "WIFI",
                      //     "sub_button": [ ]
                      // },

                  ]
              },
              {
                  "name": "积分查询",
                  "sub_button": [
                      {
                          "type": "click",
                          "name": "ID黑白查询",
                          "key": "ID_BLACK_WHITE",
                         "sub_button": [ ]
                       },
                   
                        {
                            "type": "click",
                            "name": "GSX策略查询",
                            "key": "GSX_STRATEGY_QUERY",
                            "sub_button": [ ]
                        },
                        
                        {
                            "type": "click",
                            "name": "网络锁查询",
                            "key": "NET_LOCK",
                           "sub_button": [ ]
                         },
                        //  {
                        //      "type": "click",
                        //      "name": "下次策略查询",
                        //      "key": "NEXT_QUERY",
                        //      "sub_button": [ ]
                        //   },
                        {
                            "type": "click",
                            "name": "GSX案例查询",
                            "key": "GSX_CASE_QUERY",
                            "sub_button": [ ]
                        },
                          {
                              "type": "click",
                              "name": "查国家/销售人",
                              "key": "QUERY_COUNTRY_SELLER",
                             "sub_button": [ ]
                           },
                  ]

              },

                {  "name": "我的信息",
                  "sub_button": [
                      {
                          "type": "click",
                          "name": "我的信息",
                          "key": "MY_INFORMATION",
                         "sub_button": [ ]
                       },
                       {
                         "type": "view",
                         "name": "使用说明",
                         "type":"view",
                         "url":"https://mp.weixin.qq.com/s?__biz=MzU5MzQ1MTcyMA==&mid=100000006&idx=1&sn=0f9601dac0fb163c30afab2bfd933eda&scene=19#wechat_redirect"
                        },

                        {
                            "type": "view",
                            "name": "联系客服",
                            "type":"view",
                            "url":"https://mp.weixin.qq.com/s?__biz=MzU5MzQ1MTcyMA==&mid=100000002&idx=1&sn=1e01b51beb417754c2a4a51ce8e7f836&scene=19#wechat_redirect"

                         },
                         {
                            "type": "click",
                            "name": "在线充值",
                            "key": "ONLINE_PAY",
                            "sub_button": [ ]
                         },
                         {
                             "type": "click",
                             "name": "设置默认查询",
                             "key": "DEFAULT_QUERY_SET",
                             "sub_button": [ ]
                          }

                  ]
              },

          ]
      },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });
      console.log(JSON.stringify(createResult))
      ctx.body = createResult.data;


    });


  }
}

module.exports = MenuController;
