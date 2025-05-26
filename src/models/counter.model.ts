/*
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter extends Document {
  _id: string;
  sequence_value: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  sequence_value: { type: Number, required: true },
});

const Counter = mongoose.models.Counter || mongoose.model<ICounter>('Counter', CounterSchema);
export default Counter;
