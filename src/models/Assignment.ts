import { Schema, model, Document } from 'mongoose';

export interface IAssignment extends Document {
  employeeName: string;
  employeeEmailId: string;
  secretChildName: string;
  secretChildEmailId: string;
  year: number;
}

const AssignmentSchema = new Schema<IAssignment>({
    employeeName: { type: String, required: true },
    employeeEmailId: { type: String, required: true },
    secretChildName: { type: String, required: true },
    secretChildEmailId: { type: String, required: true },
    year: { type: Number, required: true }
  });
  
  export default model<IAssignment>('Assignment', AssignmentSchema);