import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  assignmentId: Types.ObjectId;
  studentId: Types.ObjectId;
  content: string;
  fileUrl?: string;
  grade?: number;
  teacherRemarks?: string;
  aiFeedback?: string;
  status: 'submitted' | 'graded' | 'resubmit';
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, minlength: 10 },
  fileUrl: { type: String },
  grade: { type: Number, min: 0 },
  teacherRemarks: { type: String },
  aiFeedback: { type: String },
  status: { type: String, enum: ['submitted', 'graded', 'resubmit'], default: 'submitted', required: true },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
