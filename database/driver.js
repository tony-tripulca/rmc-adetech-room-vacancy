const fs = require("fs");
const path = require("path");
const { put, get } = require("@vercel/blob");

const isVercel = process.env.VERCEL === "1";

const FILE_KEY = "collections.json";

// ---------- Blob driver ----------
function createBlobDriver() {
  return {
    async read() {
      try {
        const blob = await get(FILE_KEY);

        if (!blob) return {};

        // 👇 fetch the actual file content
        const res = await fetch(blob.url);

        if (!res.ok) return {};

        const text = await res.text();

        return text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Blob read error:", err);
        return {};
      }
    },

    async write(_, data) {
      try {
        await put(FILE_KEY, JSON.stringify(data), {
          access: "public",
          contentType: "application/json",
        });
      } catch (err) {
        console.error("Blob write error:", err);
        throw err;
      }
    },
  };
}

// ---------- FS driver ----------
function createFSDriver() {
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

// ---------- factory ----------
let driver;

function getDriver() {
  if (!driver) {
    driver = isVercel ? createBlobDriver() : createFSDriver();
  }
  return Promise.resolve(driver);
}

module.exports = { getDriver };
