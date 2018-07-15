
'use strict';
const config = {
  // debug 为 true 时，用于本地调试
  // AppID: 'wxe4544a308e5a0296',
  // AppSecret: 'f2ad5010f297e7f72ab13fbfb26f14e5',
  AppID: 'wxd94b4664459cb6e0',
  AppSecret: '228d4b97fd88f28ea5cb8b2ea9a9ad15',

  typeEnumnName: {
    IMEI: "IMEI/序列号查询",
    ID: "ID激活锁查询",
    IS_REPAIR: "查看是否正在保修",
    REPAIR_PROGRESS: "维修进度查询",
    // WIFI: "WIFI蓝牙码查询",
    NET_LOCK: "网络锁查询",
    ID_BLACK_WHITE: "ID黑白查询",
    SN_TO_IMEI: "IMEI查询序列号",
    NEXT_QUERY: "下次策略查询",
    QUERY_COUNTRY_SELLER: "查国家/销售人",
    GSX_STRATEGY_QUERY:"GSX策略查询",
    GSX_CASE_QUERY:"GSX案例查询"            
  },
  numberToCode: {
    0:"SN_TO_IMEI",
    1:"IMEI",
    2:"ID",
    3:"IS_REPAIR",
    4:"REPAIR_PROGRESS",
    5:"NET_LOCK",
    6:"ID_BLACK_WHITE",
    7:"GSX_STRATEGY_QUERY",
    8:"GSX_CASE_QUERY",
    // 8:"NEXT_QUERY",
    9:"QUERY_COUNTRY_SELLER",
  },
  queryContent:{
    
  }
};
module.exports = config;
