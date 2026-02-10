const fs = require("fs");
const path = require("path");

const isVercel = !!process.env.VERCEL;

// ---------- KV DRIVER ----------
async function createKVDriver() {
  const { kv } = await import("@vercel/kv");

  return {
    async read(key) {
      return (await kv.get(key)) || {};
    },

    async write(key, value) {
      await kv.set(key, value);
    },
  };
}

// ---------- FS DRIVER ----------
function createFSDriver() {
  // 👇 collections.json inside /database
  const DB_FILE = path.join(__dirname, "collections.json");

  function readFile() {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf8");
    }

    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  }

  function writeFile(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  return {
    async read() {
      return readFile();
    },

    async write(_, value) {
      writeFile(value);
    },
  };
}

// ---------- DRIVER FACTORY ----------
let driverPromise = null;

function getDriver() {
  if (!driverPromise) {
    driverPromise = isVercel
      ? createKVDriver()
      : Promise.resolve(createFSDriver());
  }

  return driverPromise;
}

module.exports = {
  getDriver,
  isVercel,
};
