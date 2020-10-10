// 此model用于存放用户写的文章
import { Document, model, Model, Schema } from 'mongoose';

export interface IInterviewer {
  // userid
  userId: string;
  name: string;
  gender: string;
  affiliatedCompany: string;
  department: string;
  jobTitle: string;
  level: string;
  workingTerritory: string;
  trainingDate: string;
  interviewFrequency: string;
  interviewNumber: string;
  passNumber: string;
}

type InterviewerModel = Document & IInterviewer

const InterviewerSchema = new Schema (
  {
    name: { type: String, required: true },
    gender: { type: String, enum: [ '男', '女' ] },
    affiliatedCompany: { type: String },
    department: { type: String },
    jobTitle: { type: String },
    level: { type: String },
    workingTerritory: { type: String },
    trainingDate: { type: String },
    interviewFrequency: { type: String },
    interviewNumber: { type: String },
    passNumber: {type: String}
  },
  {
    timestamps: true,
    versionKey: false
  }
)

const Interviewer: Model<InterviewerModel> = model<InterviewerModel>('Interviewer', InterviewerSchema);
export default Interviewer;