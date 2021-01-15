const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const namuwikiSchema = new Schema({
    title: String,
    content: String
});

const commentSchema = new Schema({
    comment: String,
    writer_id: String,
    likes: Number
})

const videoSchema = new Schema({
    id: String,
    title: String,
    desc: String,
    tags: [ String ],
    comments: [ commentSchema ]
})

const subscriberSchema = new Schema({
    subscribers: Number,
    date: Date
})

const channelSchema = new Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: String,
    categories: [ String ],
    tags: [ String ],
    subscribers: [ subscriberSchema ],
    namuwikis: [ namuwikiSchema ],
    recent_videos: [ videoSchema ],
    popular_videos: [ videoSchema ]
});

module.exports = mongoose.model("channel", channelSchema);