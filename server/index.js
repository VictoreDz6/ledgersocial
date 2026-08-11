// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('./simple-db');
const adapter = require('./payment-adapter');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

// Create a withdrawal request
app.post('/api/withdrawals', async (req, res) => {
  try {
    const { asset, amount, recipient, note } = req.body;
    if (!asset || !amount || !recipient) return res.status(400).json({ error: 'asset, amount and recipient are required' });
    const num = Number(amount);
    if (Number.isNaN(num) || num <= 0) return res.status(400).json({ error: 'invalid amount' });

    // Minimal recipient format check for ETH addresses (starts with 0x)
    if (asset === 'ETH' || asset === 'USDT') {
      if (typeof recipient !== 'string' || !recipient.match(/^0x[0-9a-fA-F]{40}$/)) {
        return res.status(400).json({ error: 'invalid ethereum address for recipient' });
      }
    }

    // Create withdrawal record
    const id = `wd_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const rec = {
      id,
      asset,
      amount: num,
      recipient,
      note: note || null,
      status: 'queued',
      txHash: null,
      message: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.createWithdrawal(rec);

    // Process in background (in-process queue for demo)
    (async () => {
      try {
        await db.updateWithdrawalStatus(id, 'processing');
        const result = await adapter.sendWithdrawal({ id, asset, amount: num, recipient, note });
        if (result.success) {
          await db.updateWithdrawalResult(id, { status: 'completed', txHash: result.txId, message: result.message });
        } else {
          await db.updateWithdrawalResult(id, { status: 'failed', txHash: null, message: result.message });
        }
      } catch (err) {
        await db.updateWithdrawalResult(id, { status: 'failed', txHash: null, message: err.message });
      }
    })();

    return res.status(201).json({ id, status: 'queued' });
  } catch (err) {
    console.error('POST /api/withdrawals error', err);
    return res.status(500).json({ error: 'internal error' });
  }
});

// List withdrawals (demo: returns all)
app.get('/api/withdrawals', async (req, res) => {
  try {
    const all = await db.listWithdrawals();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'internal' });
  }
});

// Get single
app.get('/api/withdrawals/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const rec = await db.getWithdrawal(id);
    if (!rec) return res.status(404).json({ error: 'not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'internal' });
  }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT} (demo mode)`));
