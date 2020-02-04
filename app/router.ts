import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, jwt } = app;

  router.get('/', controller.home.index);
  router.get('/userlist', controller.user.getUserList);
  router.get('/signUp', controller.user.addUser);
  router.post('/login', controller.user.login);
  router.post('/modifyUserInfo', jwt, controller.user.modifyUserInfo);
  // TODO 加上传的token验证，一直解决不了。。。
  router.post('/uploadAvatar', controller.user.uploadAvatar);

  // ===== article 接口 =====
  // 写文章
  router.post('/addArticle', jwt, controller.article.addArticle);
  // 全部文章列表
  router.get('/articleList', controller.article.articleList);
  // 文献详情
  router.get('/articleDetail', controller.article.articleDetail);
};
