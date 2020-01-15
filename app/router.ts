import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/userlist', controller.user.getUserList);
  router.get('/signUp', controller.user.addUser);
  router.post('/login', controller.user.login);
};
