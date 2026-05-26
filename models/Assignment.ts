import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IQuestion {
  question: string;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  description?: string;
  subject: string;
  dueDate: Date;
  teacherId: Types.ObjectId;
  maxMarks: number;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, minlength: 3 },
    description: { type: String },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maxMarks: { type: Number, required: true, min: 1 },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

if (mongoose.models.Assignment) delete (mongoose.models as any).Assignment;

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
