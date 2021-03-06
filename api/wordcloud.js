const express = require("express");
const router = express.Router();

const fs = require("fs").promises;
const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", (print_logger_name = false));

const config = require(path.join(__ROOT_DIR, "config"));

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));
const Tag = require(path.join(__ROOT_DIR, "models/tag"));

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

router.get("/:id", async function (req, res, next) {
  let args = {
    id: req.params.id,
  };

  let id = req.params.id;

  try {
    let qresult = await Tag.findOne({
      id: id,
    }).exec();

    if (qresult) {
      let result_words = qresult;
      // console.log(result_words);

      logger.success("Success", (request = req), (args = args));
      return res.status(200).json(result_words);
    } else {
      logger.error(`No such ID`, (request = req), (args = args));
      return res.sendStatus(404);
    }
  } catch (err) {
    logger.error(`${err.stack}`, (request = req), (args = args));
    return res.sendStatus(400);
  }
});

module.exports = router;
