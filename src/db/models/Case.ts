import { Schema, model } from 'mongoose';
const timestamp = require('mongoose-timestamp');

const CaseSchema: Schema = new Schema({
  case: Number,
  caseType: String,
  reason: {
    type: String,
    default: 'No reason given'
  },
  prossectuter: {
    id: String,
    name: String
  },
  offender: {
    id: String,
    name: String
  },
  timestamp: String
});
CaseSchema.plugin(timestamp);

export default model('Case', CaseSchema);
