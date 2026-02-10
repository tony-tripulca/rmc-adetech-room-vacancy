const fs = require("fs");
const path = require("path");

const isVercel = !!process.env.VERCEL || !!process.env.BLOB_READ_WRITE_TOKEN;

const FILE_KEY = "collections.json";

console.log("Running on Vercel:", isVercel);

// ---------- Blob driver ----------
function createBlobDriver() {
  const { put, list } = require("@vercel/blob");

  return {
    async read() {
      try {
        const { blobs } = await list({ prefix: FILE_KEY });

        if (!blobs.length) {
          console.log("No blob found → empty DB");
          return {};
        }

        const blob = blobs[0];

        console.log("Reading blob:", blob.pathname);

        const res = await fetch(blob.url);

        if (!res.ok) {
          console.error("Fetch failed:", res.status);
          return {};
        }

        const text = await res.text();

        return text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Blob read error:", err);
        return {};
      }
    },

    async write(_, data) {
      try {
        console.log("Writing blob:", FILE_KEY);

        const result = await put(FILE_KEY, JSON.stringify(data, null, 2), {
          access: "public",
          contentType: "application/json",
          addRandomSuffix: false, // 👈 ensures stable filename
        });

        console.log("Blob write result:", result.pathname);
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
      fs.writeFileSync(DB_FILE, "{}");
    }

    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  }

  function writeFile(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }

  return {
    async read() {
      console.log("Reading local FS DB");
      return readFile();
    },

    async write(_, value) {
      console.log("Writing local FS DB");
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
