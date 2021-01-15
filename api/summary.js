const express = require("express");
const router = express.Router();

const fs = require("fs").promises;
const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", print_logger_name=false);

const config = require(path.join(__ROOT_DIR, "config"));

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

router.get("/", async function(req, res, next) {
    let summary_json;
    try {
        summary_json = await fs.readFile(path.join(__ROOT_DIR, config.SUMMARY_JSON), "utf-8");
        summary_json = JSON.parse(summary_json);

        let summary_update_date = Date.parse(summary_json.summary_update_date);
        let channels_update_date = Date.parse(summary_json.channels_update_date);
        
        if(summary_update_date < channels_update_date) {
            summary_json = await buildSummary(summary_json);
        }
    } catch(err) {
        logger.error(`${err}`, request=req);
        res.sendStatus(400);
        return;
    }
    
    let json = [];
    for (let summary_item of summary_json.summary_items) {
        try {
            let query_filter = {
                "_id": {
                    $in: summary_item.channel_ids.map((id) => {
                        return mongoose.Types.ObjectId(id);
                    })
                }
            }

            let channels = await Channel.find(query_filter).exec();

            json.push({
                "name": summary_item.name,
                "desc": summary_item.desc,
                "channels": channels
            });
        } catch (err) {
            logger.warning(`${err}`, request=req);
        }
    }

    if(json.length == 0) {
        logger.error("Empty json", request=req);
        return res.sendStatus(400);
    } else {
        logger.success("Success", request=req);
        return res.status(200).json(json);
    }
});

async function buildSummary(summary_json) {
    logger.info(`Building ${config.SUMMARY_JSON}...`);

    try {
        let funcs = require(path.join(__ROOT_DIR, config.SUMMARY_FUNCS));
        let now = moment().format();

        let summary_items = [];
        for(let summary_item of summary_json.summary_items) {
            let channel_ids = await funcs[summary_item.builder_func_name](summary_item.channel_num);

            summary_items.push({
                "name": summary_item.name,
                "desc": summary_item.desc,
                "channel_num": summary_item.channel_num,
                "builder_func_name": summary_item.builder_func_name,
                "channel_ids": channel_ids
            });
        }

        summary_json.summary_update_date = now;
        summary_json.summary_items = summary_items;

        await fs.writeFile(path.join(__ROOT_DIR, config.SUMMARY_JSON), JSON.stringify(summary_json, null, 4), "utf-8");

        logger.success(`Successfully build ${config.SUMMARY_JSON}`);
        return summary_json;
    } catch (err) {
        throw err;
    }
}

module.exports = router;