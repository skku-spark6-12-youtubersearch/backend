const path = require("path");

const utils = require(path.join(__ROOT_DIR, "utils"));
const logger = utils.logger("spark612 backend", (print_logger_name = false));

const mongoose = require("mongoose");
const Channel = require(path.join(__ROOT_DIR, "models/channel"));

module.exports = {
  subscriber_num: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          if (!channel.subscriber_num || channel.subscriber_num.length == 0) {
            return false;
          }
          return true;
        })
        .map((channel) => {
          return {
            id: channel.id,
            subscriber_num: channel.subscriber_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0],
          };
        });

      result.sort((a, b) => {
        return b.subscriber_num.value - a.subscriber_num.value;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.subscriber_num.value };
      });
    } catch (err) {
      throw err;
    }
  },
  video_num: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          if (!channel.video_num || channel.video_num.length == 0) return false;
          return true;
        })
        .map((channel) => {
          return {
            id: channel.id,
            video_num: channel.video_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0],
          };
        });

      result.sort((a, b) => {
        return b.video_num.value - a.video_num.value;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.video_num.value };
      });
    } catch (err) {
      throw err;
    }
  },
  view_num: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          if (!channel.view_num || channel.view_num.length == 0) return false;
          return true;
        })
        .map((channel) => {
          return {
            id: channel.id,
            view_num: channel.view_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0],
          };
        });

      result.sort((a, b) => {
        return b.view_num.value - a.view_num.value;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.view_num.value };
      });
    } catch (err) {
      throw err;
    }
  },
  recent_upload_video_num: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let month_video_num = 0;
        channel.videos.forEach((video) => {
          if (
            video.published_date.getTime() >
            new Date().getTime() - 2629800000
          ) {
            month_video_num += 1;
          }
        });

        return {
          id: channel.id,
          recent_video_num: month_video_num,
        };
      });

      result.sort((a, b) => {
        return b.recent_video_num - a.recent_video_num;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.recent_video_num };
      });
    } catch (err) {
      throw err;
    }
  },
  subscriber_per_view: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          if (!channel.view_num || channel.view_num.length == 0) return false;
          return true;
        })
        .filter((channel) => {
          if (!channel.subscriber_num || channel.subscriber_num.length == 0)
            return false;
          return true;
        })
        .map((channel) => {
          let view_num = channel.view_num.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0];
          let subscriber_num = channel.subscriber_num.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
          })[0];
          if (view_num.value == 0 || subscriber_num.value == 0) {
            return {
              id: channel.id,
              rating: 0,
            };
          } else {
            return {
              id: channel.id,
              rating: view_num.value / subscriber_num.value,
            };
          }
        });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  like_per_view: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let rating_list = [];

        channel.videos.forEach((video) => {
          if (
            video.like_num &&
            video.like_num.length != 0 &&
            video.view_num &&
            video.view_num.length != 0
          ) {
            let like_num = video.like_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0];
            let view_num = video.view_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0];
            if (like_num.value != 0 && view_num.value != 0) {
              rating_list.push(like_num.value / view_num.value);
            }
          }
        });

        if (rating_list.length != 0) {
          return {
            id: channel.id,
            rating:
              rating_list.reduce((sum, cur) => {
                return sum + cur;
              }, 0) / rating_list.length,
          };
        } else {
          return {
            id: channel.id,
            rating: 0,
          };
        }
      });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  comment_per_view: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let rating_list = [];

        channel.videos.forEach((video) => {
          if (
            video.comment_num &&
            video.comment_num.length != 0 &&
            video.view_num &&
            video.view_num.length != 0
          ) {
            let comment_num = video.comment_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0];
            let view_num = video.view_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0];
            if (comment_num.value != 0 && view_num.value != 0) {
              rating_list.push(comment_num.value / view_num.value);
            }
          }
        });

        if (rating_list.length != 0) {
          return {
            id: channel.id,
            rating:
              rating_list.reduce((sum, cur) => {
                return sum + cur;
              }, 0) / rating_list.length,
          };
        } else {
          return {
            id: channel.id,
            rating: 0,
          };
        }
      });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  comment_num_mean: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let comment_num_list = [];

        channel.videos.forEach((video) => {
          if (video.comment_num && video.comment_num.length != 0) {
            let comment_num = video.comment_num.sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            })[0];

            if (comment_num.value != 0) {
              comment_num_list.push(comment_num.value);
            }
          }
        });

        if (comment_num_list.length != 0) {
          return {
            id: channel.id,
            rating:
              comment_num_list.reduce((sum, cur) => {
                return sum + cur;
              }, 0) / comment_num_list.length,
          };
        } else {
          return {
            id: channel.id,
            rating: 0,
          };
        }
      });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  top_ability: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let ability_score = 0;
        for (tag of channel.youreco_tags) {
          if (tag.tag == "ability") ability_score = tag.value * 100;
        }

        return {
          id: channel.id,
          rating: ability_score,
        };
      });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  top_clean: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels.map((channel) => {
        let clean_score = 0;
        for (tag of channel.youreco_tags) {
          if (tag.tag == "clean") clean_score = tag.value * 100;
        }

        return {
          id: channel.id,
          rating: clean_score,
        };
      });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  ability_master: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          for (tag of channel.youreco_tags) {
            if (tag.tag == "master") {
              if (tag.value < 2) return false;
            }
          }
          return true;
        })
        .map((channel) => {
          return {
            id: channel.id,
            rating: 1,
          };
        });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
  ability_lecture: async function (channel_num) {
    try {
      let channels = await Channel.find().exec();

      let result = channels
        .filter((channel) => {
          for (tag of channel.youreco_tags) {
            if (tag.tag == "lecture") {
              if (tag.value < 2) return false;
            }
          }
          return true;
        })
        .map((channel) => {
          return {
            id: channel.id,
            rating: 1,
          };
        });

      result.sort((a, b) => {
        return b.rating - a.rating;
      });

      return result.slice(0, channel_num).map((item, idx) => {
        return { id: item.id, ranking: idx, score: item.rating.toFixed(2) };
      });
    } catch (err) {
      throw err;
    }
  },
};
