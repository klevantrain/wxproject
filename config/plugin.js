'use strict';

// had enabled by egg
// const path = require('path');

exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

exports.security = {
  xframe: {
    enable: false,
  },
};
exports.view = {
  enable: true,
  // package: 'egg-view',
};
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

// exports.passport = {
//   enable: true,
//   package: 'egg-passport',
// };

// exports.passportGithub = {
//   enable: true,
//   package: 'egg-passport-github',
// };
