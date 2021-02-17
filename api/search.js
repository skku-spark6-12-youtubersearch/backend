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
  let search_json;

  // 강제 리빌딩
  //   search_json = await buildSearch();

  try {
    search_json = await fs.readFile(
      path.join(__ROOT_DIR, "search.json"),
      "utf-8"
    );
    search_json = JSON.parse(search_json);
  } catch (err) {
    logger.error(`${err.stack}`, (request = req));
    res.sendStatus(400);
    return;
  }

  if (search_json.length == 0) {
    logger.error("Empty json", (request = req));
    return res.sendStatus(400);
  } else {
    logger.success("Success", (request = req));
    return res.status(200).json(search_json);
  }
});

async function buildSearch() {
  logger.info(`Building search_json ...`);

  try {
    let search_items = [];
    let qresults = await Channel.find().exec();
    for (let qresult of qresults) {
      search_items.push({
        id: qresult.id,
        title: qresult.title,
        profile: qresult.profile_img,
      });
    }

    let json = { channels: search_items };

    await fs.writeFile(
      path.join(__ROOT_DIR, "search.json"),
      JSON.stringify(json, null, 4),
      "utf-8"
    );

    logger.success(`Successfully build search.json `);
    return json;
  } catch (err) {
    throw err;
  }
}

module.exports = router;
