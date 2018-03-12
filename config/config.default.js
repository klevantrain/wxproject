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
// config.httpclient = {
//   // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
//   // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
//   // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
//   enableDNSCache: false,
//   // 对同一个域名进行 DNS 查询的最小间隔时间
//   dnsCacheLookupInterval: 10000,
//   // DNS 同时缓存的最大域名数量，默认 1000
//   dnsCacheMaxLength: 1000,
//
//   request: {
//     // 默认 request 超时时间
//     timeout: 3000,
//   },
//   key: 'eb7b94e4ca2da62a',
//
//   httpAgent: {
//     // 默认开启 http KeepAlive 功能
//     keepAlive: true,
//     // 空闲的 KeepAlive socket 最长可以存活 4 秒
//     freeSocketKeepAliveTimeout: 4000,
//     // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
//     timeout: 30000,
//     // 允许创建的最大 socket 数
//     maxSockets: Number.MAX_SAFE_INTEGER,
//     // 最大空闲 socket 数
//     maxFreeSockets: 256,
//   },
//
//   httpsAgent: {
//     // 默认开启 https KeepAlive 功能
//     keepAlive: true,
//     // 空闲的 KeepAlive socket 最长可以存活 4 秒
//     freeSocketKeepAliveTimeout: 4000,
//     // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
//     timeout: 30000,
//     // 允许创建的最大 socket 数
//     maxSockets: Number.MAX_SAFE_INTEGER,
//     // 最大空闲 socket 数
//     maxFreeSockets: 256,
//   },
// };

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
