// ------------------------------
// Lava Pizza AI Server (LOCAL OLLAMA)
// ------------------------------

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Ollama } = require('ollama');   // <-- Official Ollama JS client

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Ollama client
const ollama = new Ollama({ host: "http://localhost:11434" });

// Pizza assistant prompt
const SYSTEM_PROMPT = `
You are Lava, the friendly pizza assistant for Lava Pizza YYC in Calgary.
Help users with pizza recommendations, toppings, deals, sizes and menu info.
Keep responses short, friendly, and fun.
`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages || [];

    // Convert messages into a single conversation prompt
    const conversation = userMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const finalPrompt = `
${SYSTEM_PROMPT}

Conversation:
${conversation}

assistant:
`;

    console.log("⚡ Sending prompt to local model:", finalPrompt);

    // Ask Ollama
    const response = await ollama.generate({
      model: "llama3.1",      // 👈 MUST match downloaded model
      prompt: finalPrompt,
    });

    console.log("🔥 Ollama Response:", response.response);

    return res.json({ reply: response.response.trim() });

  } catch (error) {
    console.error("❌ OLLAMA SERVER ERROR:", error);
    return res.status(500).json({ error: "Local AI failed" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Lava Pizza AI LOCAL running on http://localhost:${PORT}`);
});
