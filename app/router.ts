import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, jwt } = app;

  router.get('/api/', controller.home.index);
  router.get('/api/userlist', controller.user.getUserList);
  router.get('/api/signUp', controller.user.addUser);
  router.post('/api/login', controller.user.login);
  router.post('/api/modifyUserInfo', jwt, controller.user.modifyUserInfo);
  // TODO 加上传的token验证，一直解决不了。。。
  router.post('/api/uploadAvatar', controller.user.uploadAvatar);

  // ===== article 接口 =====
  // 写文章
  router.post('/api/addArticle', jwt, controller.article.addArticle);
  // 全部文章列表(分页+条件筛选)
  router.get('/api/articleList', controller.article.articleList);
  // 文章详情
  router.get('/api/articleDetail', controller.article.articleDetail);

  // ===== comment 接口 =====
  // 写评论
  router.post('/api/addComment', controller.comment.addComment);
  // 查询评论
  router.get('/api/commentList', controller.comment.commentList);
};
