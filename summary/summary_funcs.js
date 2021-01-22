const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", print_logger_name=false);

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));

module.exports = {
    "subscriber_num": async function(channel_num) {
        try {
            let channels = await Channel.find().exec();

            let result = channels.filter((channel) => {
                if(!channel.subscriber_num || channel.subscriber_num.length == 0) {
                    return false;
                }
                return true;
            }).map((channel) => {
                return {
                    "id": channel.id,
                    "subscriber_num": channel.subscriber_num.sort((a, b) => { return (new Date(b.date)) - (new Date(a.date)); })[0]
                }
            });

            result.sort((a, b) => { return b.subscriber_num.value - a.subscriber_num.value; })

            return result.slice(0, channel_num).map((item) => {
                return item.id;
            });
        } catch(err) {
            throw err;
        }
    },
    "video_num": async function(channel_num) {
        try {
            let channels = await Channel.find().exec();

            let result = channels.filter((channel) => {
                if(!channel.video_num || channel.video_num.length == 0) return false;
                return true;
            }).map((channel) => {
                return {
                    "id": channel.id,
                    "video_num": channel.video_num.sort((a, b) => { return (new Date(b.date)) - (new Date(a.date)); })[0]
                }
            });

            result.sort((a, b) => { return b.video_num.value - a.video_num.value; })

            return result.slice(0, channel_num).map((item) => {
                return item.id;
            });
        } catch(err) {
            throw err;
        }
    },
    "view_num": async function(channel_num) {
        try {
            let channels = await Channel.find().exec();

            let result = channels.filter((channel) => {
                if(!channel.view_num || channel.view_num.length == 0) return false;
                return true;
            }).map((channel) => {
                return {
                    "id": channel.id,
                    "view_num": channel.view_num.sort((a, b) => { return (new Date(b.date)) - (new Date(a.date)); })[0]
                }
            });

            result.sort((a, b) => { return b.view_num.value - a.view_num.value; })

            return result.slice(0, channel_num).map((item) => {
                return item.id;
            });
        } catch(err) {
            throw err;
        }
    },
    "recent_upload_video_num": async function(channel_num) {
        //TODO: 작성 요망
    }
}