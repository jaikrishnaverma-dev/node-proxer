const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());

app.get('/api/data', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).json({ error: 'Missing url param' });

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote',
      ],
      timeout: 60000,
    });

    const page = await browser.newPage();
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    const content = await page.content();

    await browser.close();

    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server listening on port ${PORT}`));
