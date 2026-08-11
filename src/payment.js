// src/payment.js
// Minimal payment adapter for sending withdrawals.
// Default implementation: simulated network that resolves successfully after a short delay.
// Replace or augment with a real payment gateway integration for production.

async function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const simulatedAdapter = {
  async sendWithdrawal({ id, asset, amount, recipient, method }) {
    // Simulate network latency and success/failure.
    await delay(1000 + Math.random() * 800);
    // For demo, fail if amount is absurdly large (>100000) to show errors.
    if (amount > 100000) {
      return { success: false, message: "Amount too large", txId: null };
    }
    const txId = `${asset.toLowerCase()}_tx_${Math.floor(
      Math.random() * 1e9
    )}_${Date.now()}`;
    return { success: true, message: "Withdrawal queued", txId };
  },
};

// Example network-backed adapter (comment and customize):
/*
const baseUrl = process.env.PAYMENT_API_BASE || "https://payments.example.com";
const networkAdapter = {
  async sendWithdrawal({ id, asset, amount, recipient, method }) {
    const res = await fetch(`${baseUrl}/withdrawals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, asset, amount, recipient, method }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, message: err || "network error", txId: null };
    }
    return res.json();
  },
};
*/

const adapter = simulatedAdapter;
export default adapter;
