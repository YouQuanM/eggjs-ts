// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/service/Article';
import ExportComment from '../../../app/service/Comment';
import ExportLikes from '../../../app/service/Likes';
import ExportUser from '../../../app/service/User';
import ExportUserLogs from '../../../app/service/UserLogs';

declare module 'egg' {
  interface IService {
    article: ExportArticle;
    comment: ExportComment;
    likes: ExportLikes;
    user: ExportUser;
    userLogs: ExportUserLogs;
  }
}
