const express = require("express");
const router = express.Router();

const fs = require("fs").promises;
const path = require("path");

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", print_logger_name=false);

const config = require(path.join(__ROOT_DIR, "config"));

const secret = require(path.join(__ROOT_DIR, "secret"));

const Channel = require(path.join(__ROOT_DIR, "models/channel"));

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

router.post("/channel", async function(req, res, next) {
/*
id
title
desc
videos
subscribers
categories
tags
namuwikis
recent_video_ids
popular_video_ids
video_num
upload_playlist_id
country
trailer_video_id
default_language
published_date
view_num
*/
    let id = req.body.id;
    let title = req.body.title;
    let desc = req.body.desc;
    let videos = req.body.videos;
    let subscribers = req.body.subscribers;
    let categories = req.body.categories;
    let tags = req.body.tags;
    let namuwikis = req.body.namuwikis;
    let recent_video_ids = req.body.recent_video_ids;
    let popular_video_ids = req.body.popular_video_ids;
    let video_num = req.body.video_num;
    let upload_playlist_id = req.body.upload_playlist_id;
    let country = req.body.country;
    let trailer_video_id = req.body.trailer_video_id;
    let default_language = req.body.default_language;
    let published_date = req.body.published_date;
    let view_num = req.body.view_num;
    
    try {
        await (new Channel({
            id: id,
            title: title,
            desc: desc,
            videos: videos,
            subscriber_num: subscriber_num,
            categories: categories,
            tags: tags,
            namuwikis: namuwikis,
            recent_video_ids: recent_video_ids,
            popular_video_ids: popular_video_ids,
            video_num: video_num,
            upload_playlist_id: upload_playlist_id,
            country: country,
            trailer_video_id: trailer_video_id,
            default_language: default_language,
            published_date: published_date,
            view_num: view_num
        })).save();
        logger.success("Success", request=req, args=args);
        res.sendStatus(200);
    } catch(err) {
        logger.error(`${err.stack}`, request=req, args=args);
        res.sendStatus(400);
    }
});

router.post("/channels", async function(req, res, next) {
    let channels = req.body.channels;

    try {
        for(let channel of channels) {
            await (new Channel({
                id: channel.id,
                title: channel.title,
                desc: channel.desc,
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
                view_num: channel.view_num
            })).save();
        }
    } catch(err) {
        logger.error(`${err.stack}`, request=req);
        res.sendStatus(400);
        return;
    }

    try {
        summary_json = await fs.readFile(path.join(__ROOT_DIR, config.SUMMARY_JSON), "utf-8");
        summary_json = JSON.parse(summary_json);

        let now = moment().format()
        summary_json.channels_update_date = now;
        await fs.writeFile(path.join(__ROOT_DIR, config.SUMMARY_JSON), JSON.stringify(summary_json, null, 4), "utf-8");
    } catch(err) {
        logger.error(`${err.stack}`, request=req);
        res.sendStatus(400);
        return;
    }

    logger.success("Success", request=req);
    res.sendStatus(200);
});

module.exports = router;