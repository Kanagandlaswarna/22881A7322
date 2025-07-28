const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// In-memory store for URLs
const urlDatabase = new Map();

// Helper to generate random shortcode
function generateShortcode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortcode = '';
  for (let i = 0; i < length; i++) {
    shortcode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortcode;
}

// Root route — shows a welcome message
app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running. Use POST /shorturls to create short URLs.');
});

// POST /shorturls — create new short URL
app.post('/shorturls', (req, res) => {
  const { url, validity, shortcode } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'url is required' });
  }

  // Validate URL format (simple check)
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ message: 'Invalid URL format' });
  }

  // Check shortcode uniqueness or generate new
  let code = shortcode;
  if (code) {
    if (urlDatabase.has(code)) {
      return res.status(409).json({ message: 'Shortcode already exists' });
    }
  } else {
    do {
      code = generateShortcode();
    } while (urlDatabase.has(code));
  }

  // Set expiry (default 30 minutes)
  const now = new Date();
  const expiry = new Date(now.getTime() + ((validity || 30) * 60000)).toISOString();

  urlDatabase.set(code, {
    url,
    createdAt: now.toISOString(),
    expiry,
    clicks: []
  });

  res.status(201).json({ shortcode: code, url, expiry });
});

// GET /:code — redirect if exists and valid
app.get('/:code', (req, res) => {
  const code = req.params.code;
  const record = urlDatabase.get(code);

  if (!record) {
    return res.status(404).json({ message: 'Shortcode not found' });
  }

  if (new Date() > new Date(record.expiry)) {
    return res.status(410).json({ message: 'Shortcode expired' });
  }

  // Log click (time, referer, IP)
  record.clicks.push({
    time: new Date().toISOString(),
    referer: req.headers.referer || null,
    ip: req.ip
  });

  res.redirect(record.url);
});

// GET /shorturls/:code — get stats
app.get('/shorturls/:code', (req, res) => {
  const code = req.params.code;
  const record = urlDatabase.get(code);

  if (!record) {
    return res.status(404).json({ message: 'Shortcode not found' });
  }

  res.json({
    shortcode: code,
    url: record.url,
    createdAt: record.createdAt,
    expiry: record.expiry,
    clicksCount: record.clicks.length,
    clicks: record.clicks
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
