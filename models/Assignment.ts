import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  subject: string;
  dueDate: Date;
  teacherId: Types.ObjectId;
  maxMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  title: { type: String, required: true, minlength: 3 },
  description: { type: String, required: true, minlength: 10 },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  maxMarks: { type: Number, required: true, min: 1, max: 100 },
}, { timestamps: true });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
