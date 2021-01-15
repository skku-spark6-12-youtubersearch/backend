const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

module.exports.logger = function (logger_name=undefined, print_logger_name=true, STR_MAX_LEN=20) {
    return {
        "info": function(msg, request=undefined, args=undefined) {
            this._print(msg, request, args, "b");
        },
        "success": function(msg, request=undefined, args=undefined) {
            this._print(msg, request, args, "g");
        },
        "warning": function(msg, request=undefined, args=undefined) {
            this._print(msg, request, args, "y");
        },
        "error": function(msg, request=undefined, args=undefined) {
            this._print(msg, request, args, "r");
        },
        "debug": function(msg, request=undefined, args=undefined) {
            this._print(msg, request, args, "k");
        },
        "_print": function(msg, request, args, msg_color) {
            switch (msg_color) {
                case "r": //red
                    msg_color = "\x1b[31m";
                    break;
                case "y": //yellow
                    msg_color = "\x1b[33m";
                    break;
                case "b": //blue
                    msg_color = "\x1b[34m";
                    break;
                case "g": //green
                    msg_color = "\x1b[32m";
                    break;
                case "k": //black
                    msg_color = "\x1b[0m";
                    break;
                default:
                    msg_color = "\x1b[0m";
                    break;
            }

            let print = `${msg_color}[`;
            
            if(logger_name != undefined && print_logger_name == true) {
                print += `${logger_name}, `;
            }

            print += `${moment().format("YYYY-MM-DD HH:mm:ss")}]`;

            if (request != undefined) {
                print += ` [${request.originalUrl}(${request.method})]`;
            }

            print += "\x1b[0m"

            if(msg != undefined && msg.length > 0) {
                print += ` ${msg}`;
            }

            if (args != undefined) {
                for(var key in args) {
                    if(typeof args[key] === 'string') {
                        if(args[key].length > STR_MAX_LEN) {
                            args[key] = args[key].substring(0, STR_MAX_LEN) + "...";
                        }
                    }
                }

                print += ` - ${JSON.stringify(args)}`
            }

            console.log(print);
        }
    }
}

module.exports.request_logger = function(logger) {
    return function(req, res, next) {
        logger._print(`${req.originalUrl} (${req.method})`, request=undefined, args=undefined, msg_color="k");
        next();
    };
}