const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) return { withdrawals: [] };
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { withdrawals: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  init() {
    if (!fs.existsSync(DATA_FILE)) writeData({ withdrawals: [] });
  },

  createWithdrawal(rec) {
    const data = readData();
    data.withdrawals.unshift(rec);
    writeData(data);
    return rec;
  },

  getWithdrawal(id) {
    const data = readData();
    return data.withdrawals.find((w) => w.id === id) || null;
  },

  listWithdrawals() {
    const data = readData();
    return data.withdrawals;
  },

  updateWithdrawal(id, changes) {
    const data = readData();
    const idx = data.withdrawals.findIndex((w) => w.id === id);
    if (idx === -1) return null;
    data.withdrawals[idx] = { ...data.withdrawals[idx], ...changes, updatedAt: new Date().toISOString() };
    writeData(data);
    return data.withdrawals[idx];
  },
};
