const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./simple-db');
const payment = require('./payment-adapter');
require('dotenv').config();

db.init();

const app = express();
app.use(cors());
app.use(express.json());

const QUEUE = [];
let processing = false;

async function processQueue() {
  if (processing) return;
  processing = true;
  while (QUEUE.length > 0) {
    const job = QUEUE.shift();
    try {
      db.updateWithdrawal(job.id, { status: 'processing', updatedAt: new Date().toISOString() });
      const result = await payment.sendWithdrawal(job);
      if (result && result.success) {
        db.updateWithdrawal(job.id, { status: 'completed', txHash: result.txId, message: result.message, updatedAt: new Date().toISOString() });
      } else {
        db.updateWithdrawal(job.id, { status: 'failed', message: (result && result.message) || 'unknown error', updatedAt: new Date().toISOString() });
      }
    } catch (err) {
      db.updateWithdrawal(job.id, { status: 'failed', message: err.message, updatedAt: new Date().toISOString() });
    }
    // small delay between jobs
    await new Promise((r) => setTimeout(r, 500));
  }
  processing = false;
}

// create a withdrawal request
app.post('/api/withdrawals', (req, res) => {
  const { asset, amount, recipient, note } = req.body || {};
  if (!asset || !amount || !recipient) return res.status(400).json({ error: 'asset, amount and recipient are required' });
  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) return res.status(400).json({ error: 'amount must be a positive number' });
  // basic ETH address validation for ETH
  if (asset === 'ETH' && !/^0x[a-fA-F0-9]{40}$/.test(recipient)) return res.status(400).json({ error: 'invalid ETH recipient address' });

  const id = uuidv4();
  const rec = {
    id,
    userId: 'demo-user',
    asset,
    amount: num,
    recipient,
    note: note || null,
    status: 'queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.createWithdrawal(rec);
  QUEUE.push(rec);
  // kick the worker
  processQueue().catch((e) => console.error('queue processor error', e));

  res.status(201).json({ id: rec.id, status: rec.status, createdAt: rec.createdAt });
});

// list withdrawals (demo: returns all)
app.get('/api/withdrawals', (req, res) => {
  const all = db.listWithdrawals();
  res.json(all);
});

// get one
app.get('/api/withdrawals/:id', (req, res) => {
  const w = db.getWithdrawal(req.params.id);
  if (!w) return res.status(404).json({ error: 'not found' });
  res.json(w);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`ledger-social demo withdrawals server listening on ${port}`));
