const { okay, notAllowed } = require("../../lib/response");
const db = require("../../database/service");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return notAllowed(res);
  }

  const rooms = await db.findAll("rooms");
  return okay(res, rooms);
};
