// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/service/Article';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    article: ExportArticle;
    user: ExportUser;
  }
}
