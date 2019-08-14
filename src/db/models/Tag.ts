import { Schema, model } from "mongoose";
const timestamp = require("mongoose-timestamp");

const tagSchema: Schema = new Schema({
  id: String,
  guildID: String,
  tag: String
});

tagSchema.plugin(timestamp);
export default model("Tag", tagSchema);
