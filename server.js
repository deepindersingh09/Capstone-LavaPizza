// server.js (root of Capstone-LavaPizza)

// ---- Imports ----
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const OpenAI = require('openai');

// ---- App Setup ----
const app = express();
app.use(cors());
app.use(express.json());

// ---- OpenAI Client ----
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---- Lava Pizza System Prompt ----
const SYSTEM_PROMPT = `
You are Lava, the friendly AI assistant for Lava Pizza YYC in Calgary.
- Answer questions about menu items, toppings, sizes, and deals.
- Help customers build pizzas within their budget.
- If you don't know something (like exact real-time prices or hours), say you're not sure and suggest checking the app's official sections.
- Keep responses short, friendly, and casual, like a chill friend helping them order pizza.
`;

// ---- Chat Endpoint ----
app.post('/api/chat', async (req, res) => {
  try {
    const bodyMessages = req.body.messages || [];

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...bodyMessages,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages,
      max_tokens: 250,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't come up with a response.";

    res.json({ reply });
  } catch (err) {
    console.error('Chat error on server:', err);
    res.status(500).json({ error: 'Failed to generate response from AI' });
  }
});

// ---- Start Server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Lava chat server running on port ${PORT}`);
});
