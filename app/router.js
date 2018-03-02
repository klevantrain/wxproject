'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // app.passport.mount('github');
  router.get('/toLogin', controller.home.index);
  router.get('/', controller.home.index);

  router.post('/login', controller.login.loginIn);
  router.get('/loginOut', controller.login.loginOut);

  router.get('/userHome', controller.user.userList);
  router.post('/getUserInfo', controller.user.getUserInfo);
  router.post('/updateUserBalance', controller.user.updateUserBalance);
  router.post('/managerUserBlance', controller.user.managerUserBlance);



  router.get('/toSecond', controller.manageinfo.toSecond);
  router.get('/manager', controller.manageinfo.find);
  router.post('/getManageInfo', controller.manageinfo.getManageInfo);
  router.post('/updateManage', controller.manageinfo.updateManage);
  router.post('/managerAdd', controller.manageinfo.managerAdd);
  router.post('/deleteManageInfo', controller.manageinfo.deleteManageInfo);

  router.post('/getSearchLog', controller.search.getSearchLog);

  router.get('/auth', controller.auth.auth);
  router.post('/auth', controller.auth.auth);

};
