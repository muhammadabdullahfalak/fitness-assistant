// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ text: "API key missing" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      // If Gemini returns an error or no valid response, check for error message
      if (data?.error?.message) {
        text = `Sorry, I can only answer fitness, health, nutrition, or workout-related questions. Please ask something related to fitness!`;
      } else {
        text = `Sorry, I can only answer fitness, health, nutrition, or workout-related questions. Please ask something related to fitness!`;
      }
    }
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));