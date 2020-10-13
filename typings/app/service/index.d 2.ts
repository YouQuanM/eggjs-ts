// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportInterviewer from '../../../app/service/Interviewer';

declare module 'egg' {
  interface IService {
    interviewer: ExportInterviewer;
  }
}
