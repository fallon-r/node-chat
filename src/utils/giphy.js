require("dotenv").config();
const request = require("postman-request");
const giphy = process.env.GIPHY_URL_START;

const findGif = (search, callback) => {
  const url = giphy + search;
  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("There was an error", undefined);
    } else if (response.body.error) {
      callback("Something weird happened", undefined);
    } else {
      callback(undefined, {
        bigGif: response.body.data[0].images.original.url,
        smallGif: response.body.data[0].images.fixed_width.url,
      });
    }
  });
};

module.exports = { findGif };
