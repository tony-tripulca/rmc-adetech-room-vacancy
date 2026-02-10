const store = global.__LOCAL_DB__ || {
  collections: {},
};

global.__LOCAL_DB__ = store;

// helpers
function ensure(name) {
  if (!store.collections[name]) {
    store.collections[name] = [];
  }
  return store.collections[name];
}

function id() {
  const value = crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "")
    : Date.now().toString(36) + Math.random().toString(36).slice(2);

  return value.slice(0, 8);
}

const db = {
  create(collection, data) {
    const col = ensure(collection);
    const record = { id: id(), ...data };
    col.push(record);
    return record;
  },

  findAll(collection) {
    return [...ensure(collection)];
  },

  findById(collection, recordId) {
    return ensure(collection).find((x) => x.id === recordId) || null;
  },

  update(collection, recordId, updates) {
    const col = ensure(collection);
    const item = col.find((x) => x.id === recordId);
    if (!item) return null;

    Object.assign(item, updates);
    return item;
  },

  remove(collection, recordId) {
    const col = ensure(collection);
    const index = col.findIndex((x) => x.id === recordId);
    if (index === -1) return false;

    col.splice(index, 1);
    return true;
  },

  debug() {
    return store.collections;
  },
};

module.exports = db;
