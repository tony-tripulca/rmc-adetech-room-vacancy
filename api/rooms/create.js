require("../models");
const { okay, badRequest, notAllowed } = require("../../lib/response");
const { bodyParser } = require("../../lib/body-parser");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return notAllowed(res);
  }

  let body;

  try {
    body = await bodyParser(req);
  } catch (err) {
    return badRequest(res, err.message);
  }

  global.rooms.push(body);

  return okay(res, body);
};
