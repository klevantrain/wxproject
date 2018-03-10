'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = '_1517759935166_4104';

  // add your config here
  config.middleware = [ 'interceptor' ];
  config.mysql = {
  // 单数据库信息配置
  client: {
    // host
    host: 'localhost',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: 'root',
    // 数据库名
    database: 'weproject',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};
// config.passportGithub = {
//     key: 'f727c9ab29a986fed540',
//     secret: 'd6b5b46be25e68bf9a134666a1d76973934e7382',
// };
config.view = {
  mapping: {
    '.ejs': 'ejs',
  },
};

  config.security = {
    csrf: {
      enable: false,
      ignore: '/auth',
    },
  };

// config.security = {
//   domainWhiteList:[ 'localhost' ],  // security whitelist, starts with '.'
// };

// config.view = {
//     root: path.join(appInfo.baseDir, 'app/view'),
//     cache: true,
//     defaultExtension: '.html',
//     defaultViewEngine: '',
//     mapping: '.html',
//   };
// config.view = {
//   mapping: {
//     '.nj': 'nunjucks',
//   },
// };
  return config;
};
