const express = require("express");
const router = express.Router();

const utils = require("../utils");
const logger = utils.logger("spark612 backend", print_logger_name=false);

const secret = require("../secret");

const Channel = require("../models/channel");

// Authorization
router.use(function(req, res, next) {
    let token = req.header("x-access-token");

    if (token != secret.ADMIN_TOKEN) {
        logger.error("Invalid token", request=req, args={token: token});
        res.sendStatus(401);
        return;
    }

    next();
});

router.post("/channel", function(req, res, next) {
    let args = {
        id: req.body.id,
        title: req.body.title,
        desc: req.body.desc,
        categories: req.body.categories,
        tags: req.body.tags,
        subscribers: req.body.subscribers,
        namuwikis: req.body.namuwikis,
        recent_videos: req.body.recent_videos,
        popular_videos: req.body.popular_videos
    }

    let id = req.body.id;
    let title = req.body.title;
    let desc = req.body.desc;
    let categories = req.body.categories;
    let tags = req.body.tags;
    let subscribers = req.body.subscribers;
    let namuwikis = req.body.namuwikis;
    let recent_videos = req.body.recent_videos;
    let popular_videos = req.body.popular_videos;

    let channel = new Channel({
        id: id,
        title: title,
        desc: desc,
        categories: categories,
        tags: tags,
        subscribers: subscribers,
        namuwikis: namuwikis,
        recent_videos: recent_videos,
        popular_videos: popular_videos
    });

    channel.save(function(err, channel) {
        if(err) {
            logger.error(`${err}`, request=req, args=args);
            res.sendStatus(400);
        } else {
            logger.success("Success", request=req, args=args);
            res.sendStatus(200);
        }
    });
});

module.exports = router;