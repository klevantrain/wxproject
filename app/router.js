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
  router.post('/getUserInfo', controller.user.getUserInfo);
  router.get('/test', controller.login.ceshi);
  router.post('/updateUserBalance', controller.user.updateUserBalance);
  // router.get('/add', controller.home.add);
  router.get('/manager', controller.manageinfo.find);
  router.post('/getManageInfo', controller.manageinfo.getManageInfo);
  router.post('/updateManage', controller.manageinfo.updateManage);

};
