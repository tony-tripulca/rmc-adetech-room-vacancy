const { okay, notAllowed } = require("../../lib/response");
const db = require("../../lib/local-db");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return notAllowed(res);
  }

  const rooms = db.findAll("rooms");
  return okay(res, rooms);
};
