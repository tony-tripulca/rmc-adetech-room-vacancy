const { okay, notAllowed } = require("../../lib/response");
const db = require("../../database/service");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return notAllowed(res);
  }

  const users = await db.findAll("users");

  return okay(res, users);
};
