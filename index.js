const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/data", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send("Missing url parameter");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.content();
    await browser.close();

    res.set("Access-Control-Allow-Origin", "*"); // Enable CORS for frontend apps
    res.send(html);
  } catch (err) {
    console.error("Puppeteer error:", err);
    res.status(500).send("Puppeteer error: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
