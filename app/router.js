'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // app.passport.mount('github');
  // router.get('/logout', 'user.logout');
  router.get('/toLogin', controller.home.index);
  router.get('/', controller.home.index);
  router.post('/login', controller.login.loginIn);
  router.get('/loginOut', controller.login.loginOut);
  router.get('/userHome', controller.user.userList);

  // router.get('/add', controller.home.add);
  router.get('/manager', controller.manageinfo.find);
  router.get('/test', controller.login.ceshi);
};
