const crypto = require("crypto");
const { getDriver } = require("./driver");

const ROOT_KEY = "lite-db";
let driverPromise = getDriver();

// ---------- helpers ----------

function id() {
  const value = crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "")
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

  return value.slice(0, 8);
}

async function load() {
  const driver = await driverPromise;
  return (await driver.read(ROOT_KEY)) || {};
}

async function save(data) {
  const driver = await driverPromise;
  await driver.write(ROOT_KEY, data);
}

function ensure(db, name) {
  if (!db[name]) db[name] = [];
  return db[name];
}

// ---------- service API ----------

const db = {
  async create(collection, data) {
    const dbData = await load();
    const col = ensure(dbData, collection);

    const record = { id: id(), ...data };
    col.push(record);

    await save(dbData);
    return record;
  },

  async findAll(collection) {
    const dbData = await load();
    return [...ensure(dbData, collection)];
  },

  async findById(collection, recordId) {
    const items = await this.findAll(collection);
    return items.find((x) => x.id === recordId) || null;
  },

  async update(collection, recordId, updates) {
    const dbData = await load();
    const col = ensure(dbData, collection);

    const item = col.find((x) => x.id === recordId);
    if (!item) return null;

    Object.assign(item, updates);
    await save(dbData);

    return item;
  },

  async remove(collection, recordId) {
    const dbData = await load();
    const col = ensure(dbData, collection);

    const index = col.findIndex((x) => x.id === recordId);
    if (index === -1) return false;

    col.splice(index, 1);
    await save(dbData);

    return true;
  },

  async debug() {
    return await load();
  },
};

module.exports = db;
