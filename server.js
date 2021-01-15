const express = require("express");
const app = express();

const process = require("process");
const path = require("path");
global.__ROOT_DIR = `${__dirname}/`

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", print_logger_name=false);

const config = require(path.join(__ROOT_DIR, "config"));

const mongoose = require("mongoose");
mongoose.connect(`mongodb://${config.DB_HOSTNAME}:${config.DB_PORT}/${config.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, function(err, db) {
    if(err) {
        logger.error("DB Connection Error");
        process.exit(1);
    } else {
        logger.success("DB Connection Success");
    }
});

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}));

app.use(express.json({
    limit: "50mb"
}));

app.use(utils.request_logger(logger));

app.use("/admin", require(path.join(__ROOT_DIR, "api/admin")));
app.use("/summary", require(path.join(__ROOT_DIR, "api/summary")));

app.listen(9000, "0.0.0.0", () => {
    logger.info("Listening at http://0.0.0.0:9000");
});