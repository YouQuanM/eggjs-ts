import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/api/', controller.home.index);
  router.get('/api/getList', controller.interviewer.interviewerList);
  router.get('/api/addInterviewer', controller.interviewer.addInterviewer);
};
