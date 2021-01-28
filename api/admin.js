const express = require("express");
const router = express.Router();

const fs = require("fs").promises;
const path = require("path");

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", (print_logger_name = false));

const config = require(path.join(__ROOT_DIR, "config"));

const secret = require(path.join(__ROOT_DIR, "secret"));

const Channel = require(path.join(__ROOT_DIR, "models/channel"));

// Authorization
router.use(function (req, res, next) {
  if (req.method == "OPTIONS" || req.method == "options") next();

  let token = req.header("x-access-token");

  if (token != secret.ADMIN_TOKEN) {
    logger.error("Invalid token", (request = req), (args = { token: token }));
    res.sendStatus(401);
    return;
  }

  next();
});

router.post("/channels", async function (req, res, next) {
  let channels = req.body.channels;

  try {
    if (
      (
        await mongoose.connection.db
          .listCollections({ name: Channel.collection.name })
          .toArray()
      ).length != 0
    ) {
      await Channel.collection.drop();
    }

    for (let channel of channels) {
      await new Channel({
        id: channel.id,
        title: channel.title,
        desc: channel.desc,
        sex: channel.sex,
        live_platform: channel.live_platform,
        profile_img: channel.profile_img,
        banner_img: channel.banner_img,
        videos: channel.videos,
        subscriber_num: channel.subscriber_num,
        categories: channel.categories,
        tags: channel.tags,
        namuwikis: channel.namuwikis,
        recent_video_ids: channel.recent_video_ids,
        popular_video_ids: channel.popular_video_ids,
        video_num: channel.video_num,
        upload_playlist_id: channel.upload_playlist_id,
        country: channel.country,
        trailer_video_id: channel.trailer_video_id,
        default_language: channel.default_language,
        published_date: channel.published_date,
        view_num: channel.view_num,
      }).save();
    }
  } catch (err) {
    logger.error(`${err.stack}`, (request = req));
    res.sendStatus(400);
    return;
  }

  try {
    summary_json = await fs.readFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      "utf-8"
    );
    summary_json = JSON.parse(summary_json);

    let now = moment().format();
    summary_json.channels_update_date = now;
    await fs.writeFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      JSON.stringify(summary_json, null, 4),
      "utf-8"
    );
  } catch (err) {
    logger.error(`${err.stack}`, (request = req));
    res.sendStatus(400);
    return;
  }

  logger.success("Success", (request = req));
  res.sendStatus(200);
  return;
});

router.post("/channel/:id", async function (req, res, next) {
  let args = {
    id: req.params.id,
    overwrite: req.query.overwrite,
  };

  let overwrite = false; // 덮어쓰기 모드 (Default: false)
  if (req.query.overwrite === "true") overwrite = true;

  let id = req.params.id;

  let channel;
  try {
    channel = await Channel.findOne({ id: id }).exec();
    if (!channel) {
      logger.error(`No such ID`, (request = req), (args = args));
      res.sendStatus(404);
      return;
    }
  } catch (err) {
    logger.error(`${err.stack}`, (request = req), (args = args));
    res.sendStatus(400);
    return;
  }

  if (overwrite) {
    let keys = [
      "title",
      "desc",
      "sex",
      "live_platform",
      "profile_img",
      "banner_img",
      //   "videos",
      "subscriber_num",
      "categories",
      "tags",
      "namuwikis",
      "recent_video_ids",
      "popular_video_ids",
      "video_num",
      "upload_playlist_id",
      "country",
      "trailer_video_id",
      "default_language",
      "published_date",
      "view_num",
    ];

    for (let key of keys) {
      if (req.body[key]) {
        channel[key] = req.body[key];
      }
    }
    if (req.body.videos) {
      let video_keys = ["title", "desc", "game_tag"];
      let vids = channel.videos.map((video) => {
        return video.id;
      });

      req.body.videos.forEach((overwrited_video) => {
        if (vids.includes(overwrited_video.id)) {
          for (let key of video_keys) {
            if (overwrited_video[key]) {
              channel.videos[vids.indexOf(overwrited_video.id)][key] =
                overwrited_video[key];
            }
          }
        }
      });
    }
  } else {
    if (req.body.videos) {
      let vids = channel.videos.map((video) => {
        return video.id;
      });

      req.body.videos.forEach((new_video) => {
        if (!vids.includes(new_video.id)) {
          channel.videos.push(new_video);
        }
      });
    }

    if (req.body.namuwikis) {
      let titles = channel.namuwikis.map((namuwiki) => {
        return namuwiki.title;
      });

      req.body.namuwikis.forEach((new_namuwiki) => {
        if (!titles.includes(new_namuwiki.title)) {
          channel.namuwikis.push(namuwiki);
        }
      });
    }

    for (let key of ["categories", "tags"]) {
      if (req.body[key]) {
        req.body[key].forEach((value) => {
          if (!channel[key].includes(value)) {
            channel[key].push(value);
          }
        });
      }
    }

    for (let key of ["recent_video_ids", "popular_video_ids"]) {
      let vids = channel.videos.map((video) => {
        return video.id;
      });

      if (req.body[key]) {
        req.body[key].forEach((vid) => {
          // videos에 해당 id를 가진 동영상이 있으면서, channel에 해당 값이 없는 경우에만 push
          if (vids.includes(vid) && !channel[key].includes(vid)) {
            channel[key].push(vid);
          }
        });
      }
    }

    for (let key of ["subscriber_num", "video_num", "view_num"]) {
      if (req.body[key]) {
        let dates = channel[key].map((item) => {
          return item.date;
        });

        req.body[key].forEach((item) => {
          if (!dates.includes(item.date)) {
            channel[key].push(item);
          }
        });
      }
    }
  }

  try {
    await channel.save();
  } catch (err) {
    logger.error(`${err.stack}`, (request = req), (args = args));
    res.sendStatus(400);
    return;
  }

  try {
    summary_json = await fs.readFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      "utf-8"
    );
    summary_json = JSON.parse(summary_json);

    let now = moment().format();
    summary_json.channels_update_date = now;
    await fs.writeFile(
      path.join(__ROOT_DIR, config.SUMMARY_JSON),
      JSON.stringify(summary_json, null, 4),
      "utf-8"
    );
  } catch (err) {
    logger.error(`${err.stack}`, (request = req));
    res.sendStatus(400);
    return;
  }

  logger.success("Success", (request = req), (args = args));
  res.status(200).json(channel);
  return;
});

module.exports = router;
