const express = require("express");
const router = express.Router();

const fs = require("fs").promises;
const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", (print_logger_name = false));

const config = require(path.join(__ROOT_DIR, "config"));

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

router.get("/", async function (req, res, next) {
  let summary_json;
  try {
    summary_json = await fs.readFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      "utf-8"
    );
    summary_json = JSON.parse(summary_json);

    let summary_update_date = Date.parse(summary_json.summary_update_date);
    let channels_update_date = Date.parse(summary_json.channels_update_date);

    if (summary_update_date < channels_update_date) {
      summary_json = await buildSummary(summary_json);
    }
    // 강제 리빌딩
    // summary_json = await buildSummary(summary_json);
  } catch (err) {
    logger.error(`${err.stack}`, (request = req));
    res.sendStatus(400);
    return;
  }

  let json = [];
  for (let summary_item of summary_json.summary_items) {
    try {
      let query_filter = {
        id: {
          $in: summary_item.channel_ids.map((item) => item.id),
        },
      };

      let id_rank_list = summary_item.channel_ids;
      let qresults = await Channel.find(query_filter).exec();
      let channels = [];
      for (let qresult of qresults) {
        let qresult_rank = 0;
        id_rank_list.forEach((id_rank) => {
          if (id_rank.id == qresult.id) qresult_rank = id_rank.ranking;
        });
        let qresult_game_tag = new Set();
        qresult.videos.forEach((video) => {
          qresult_game_tag.add(video.game_tag);
        });
        channels.push({
          channel_id: qresult.id,
          channel_rank: qresult_rank,
          channel_filter: [qresult.sex, ...qresult_game_tag],
          channel_title: qresult.title,
          channel_photo: qresult.profile_img,
          subscriber_num: qresult.subscriber_num.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0],
          video_num: qresult.video_num.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0],
          view_num: qresult.view_num.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0],
        });
      }

      json.push({
        list_name: summary_item.name,
        list_desc: summary_item.desc,
        channels: channels,
      });
    } catch (err) {
      logger.warning(`${err.stack}`, (request = req));
    }
  }

  if (json.length == 0) {
    logger.error("Empty json", (request = req));
    return res.sendStatus(400);
  } else {
    logger.success("Success", (request = req));
    return res.status(200).json(json);
  }
});

async function buildSummary(summary_json) {
  logger.info(`Building ${config.SUMMARY_JSON}...`);

  try {
    let funcs = require(path.join(__ROOT_DIR, config.SUMMARY_FUNCS));
    let now = moment().format();

    let summary_items = [];
    for (let summary_item of summary_json.summary_items) {
      let channel_ids = await funcs[summary_item.builder_func_name](
        summary_item.channel_num
      );

      summary_items.push({
        name: summary_item.name,
        desc: summary_item.desc,
        channel_num: summary_item.channel_num,
        builder_func_name: summary_item.builder_func_name,
        channel_ids: channel_ids,
      });
    }

    summary_json.summary_update_date = now;
    summary_json.summary_items = summary_items;

    await fs.writeFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      JSON.stringify(summary_json, null, 4),
      "utf-8"
    );

    logger.success(`Successfully build ${config.SUMMARY_JSON}`);
    return summary_json;
  } catch (err) {
    throw err;
  }
}

module.exports = router;
