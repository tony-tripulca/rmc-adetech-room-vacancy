const { okay, badRequest, notAllowed } = require("../../lib/response");
const { bodyParser } = require("../../lib/body-parser");
const db = require("../../database/service");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return notAllowed(res);
  }

  try {
    const body = await bodyParser(req);
    const result = await db.create("rooms", body);

    return okay(res, result);
  } catch (err) {
    return badRequest(res, err.message);
  }
};
