'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // app.passport.mount('github');
  // router.get('/logout', 'user.logout');
  router.get('/', controller.home.index);
  router.post('/login', controller.login.login);
  router.get('/add', controller.home.add);
  router.get('/manager', controller.manageinfo.find);
  router.get('/test', controller.login.ceshi);
};
