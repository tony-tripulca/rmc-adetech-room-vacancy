const { okay, badRequest, notAllowed } = require("../../lib/response");
const { bodyParser } = require("../../lib/body-parser");
const db = require("../../database/service");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return notAllowed(res);
  }

  let body;

  try {
    body = await bodyParser(req);
    db.create("rooms", body);

  } catch (err) {
    return badRequest(res, err.message);
  }

  return okay(res, body);
};
