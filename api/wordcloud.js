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

const PythonShell = require("python-shell");

router.get("/:id", async function (req, res, next) {
  let args = {
    id: req.params.id,
  };

  let id = req.params.id;

  try {
    let qresult = await Channel.findOne({
      id: id,
    }).exec();

    if (qresult) {
      const options = {
        mode: "text",
        pythonPath: "",
        pythonOptions: ["-u"],

        scriptPath: "/home/user1/server/spark6-12/backend/Engine/",

        args: [qresult.namuwikis[0].content],
      };

      let result_words = null;

      PythonShell.PythonShell.run(
        "createWordcloud.py",
        options,
        function (err, results) {
          if (err) throw err;

          result_words = JSON.parse(results[0]);
          console.log(result_words);
          logger.success("Success", (request = req), (args = args));
          return res.status(200).json(result_words);
        }
      );

      const test_word = {
        text: "adlkfjdlkf",
        value: 14,
      };

      // logger.success("Success", (request = req), (args = args));
      // return res.status(200).json(result_words);
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
