const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", print_logger_name=false);

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));

module.exports = {
    "subscribers": async function(channel_num) {
        try {
            let channels = await Channel.find().exec();

            let result = channels.map((channel) => {
                return {
                    "_id": channel._id,
                    "subscribers": channel.subscribers[channel.subscribers.length - 1]
                }
            });

            result.sort((a, b) => { return b.subscribers - a.subscribers; })

            return result.slice(0, channel_num).map((item) => {
                return item.subscribers;
            })
        } catch(err) {
            throw err;
        }
    }
}