import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, jwt } = app;

  router.get('/', controller.home.index);
  router.get('/userlist', controller.user.getUserList);
  router.get('/addUser', controller.user.addUser);
  router.post('/login', controller.user.login);
  router.post('/userInfo', jwt, controller.user.userInfo)
};
