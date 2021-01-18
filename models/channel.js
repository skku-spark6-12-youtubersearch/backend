const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const valueHistorySchema = new Schema({
    value: Number,
    date: Date
});

const namuwikiSchema = new Schema({
    title: String,
    content: String
});

const commentSchema = new Schema({
    comment: String,
    writer_id: String,
    like_num: Number
})

const videoSchema = new Schema({
    id: {type: String, index: true},
    title: String,
    desc: String,
    published_date: Date,
    like_num: [ valueHistorySchema ],
    dislike_num: [ valueHistorySchema ],
    comment_num: [ valueHistorySchema ],
    view_num: [ valueHistorySchema ],
    //comments: [ commentSchema ],
    categories: [ String ],
    tags: [ String ]
});

const channelSchema = new Schema({
    id: {type: String, index: true},
    title: String,
    desc: String,
    videos: [ videoSchema ],
    subscriber_num: [ valueHistorySchema ],
    categories: [ String ],
    tags: [ String ],
    namuwikis: [ namuwikiSchema ],
    recent_video_ids: [ String ],
    popular_video_ids: [ String ],
    video_num: [ valueHistorySchema ],
    upload_playlist_id: String,
    country: String,
    trailer_video_id: String,
    default_language: String,
    published_date: Date,
    view_num: [ valueHistorySchema ]
});

module.exports = mongoose.model("channel", channelSchema);