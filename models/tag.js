const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const yourecoTagSchema = new Schema({
  tag: String,
  value: Number,
});

const namuTagSchema = new Schema({
  tag: String,
  value: Number,
});

const gameTagSchema = new Schema({
  tag: String,
  value: Number,
});

const videoTagSchema = new Schema({
  tag: String,
  value: Number,
});

const commentTagSchema = new Schema({
  tag: String,
  value: Number,
});

const tagSchema = new Schema({
  id: { type: String, index: true },
  title: String,
  youreco_tags: [yourecoTagSchema],
  namu_tags: [namuTagSchema],
  game_tags: [gameTagSchema],
  video_tags: [videoTagSchema],
  comment_tags: [commentTagSchema],
  youtuber_tags: [String],
  sex: String,
  live_platform: [String],
});

module.exports = mongoose.model("tag", tagSchema);
