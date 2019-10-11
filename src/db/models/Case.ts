import { Schema, model, Document } from 'mongoose';
import timestamp = require('mongoose-timestamp');

export interface ICase extends Document {
  case: number;
  caseType: string;
  reason?: string;
  prossecuter: {
    id: string;
    name: string;
  };
  offender: {
    id: string;
    name: string;
  };
  timestamp: Date;
}

const CaseSchema: Schema = new Schema({
  case: Number,
  caseType: String,
  reason: {
    type: String,
    default: 'No reason given',
  },
  prossectuter: {
    id: String,
    name: String,
  },
  offender: {
    id: String,
    name: String,
  },
  timestamp: { type: Date, default: Date.now() },
});
CaseSchema.plugin(timestamp);

const Case = model('Case', CaseSchema);
export default Case;
