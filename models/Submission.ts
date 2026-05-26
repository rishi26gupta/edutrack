import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAnswer {
  answer: string;
}

export interface ISubmission extends Document {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  content: string;
  answers: IAnswer[];
  fileUrl?: string;
  grade?: number;
  aiSuggestedGrade?: number;
  aiBreakdown?: string[];
  teacherRemarks?: string;
  aiFeedback?: string;
  status: 'submitted' | 'graded' | 'resubmit';
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>(
  { answer: { type: String, default: '' } },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, minlength: 1 },
    answers: { type: [AnswerSchema], default: [] },
    fileUrl: { type: String },
    grade: { type: Number, min: 0 },
    aiSuggestedGrade: { type: Number },
    aiBreakdown: { type: [String] },
    teacherRemarks: { type: String },
    aiFeedback: { type: String },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmit'],
      default: 'submitted',
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models.Submission) delete (mongoose.models as any).Submission;

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
