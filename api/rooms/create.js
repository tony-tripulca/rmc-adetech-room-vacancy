const { okay, badRequest, notAllowed } = require("../../lib/response");
const { bodyParser } = require("../../lib/body-parser");
const db = require("../../database/service");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return notAllowed(res);
  }

  let result;

  try {
    result = await db.create("rooms", await bodyParser(req));
    console.log("Created:", result);
  } catch (err) {
    return badRequest(res, err.message);
  }

  return okay(res, result);
};
