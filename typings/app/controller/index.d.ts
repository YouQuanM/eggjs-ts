// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/controller/article';
import ExportComment from '../../../app/controller/comment';
import ExportHome from '../../../app/controller/home';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    article: ExportArticle;
    comment: ExportComment;
    home: ExportHome;
    user: ExportUser;
  }
}
