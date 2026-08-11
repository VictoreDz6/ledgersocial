// server/payment-adapter.js
// Simulated payment adapter for the server. This is used in demo mode and does not send real transactions.

function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

const simulatedAdapter = {
  async sendWithdrawal({ id, asset, amount, recipient, note }) {
    await delay(800 + Math.random() * 600);
    // introduce a fake failure for very large amounts
    if (amount > 100000) return { success: false, message: 'amount too large', txId: null };
    const txId = `${asset.toLowerCase()}_tx_${Math.floor(Math.random() * 1e9)}_${Date.now()}`;
    return { success: true, message: 'simulated broadcast', txId };
  },
};

// Placeholder for real adapters: KMS, Fireblocks, etc.
/*
const realAdapter = {
  async sendWithdrawal({ id, asset, amount, recipient, note }) {
    // Implement real provider integration here using ethers.js, KMS, or custody provider SDK.
  }
};
*/

module.exports = simulatedAdapter;
