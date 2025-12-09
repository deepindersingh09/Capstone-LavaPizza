// ------------------------------
// Lava Pizza AI Server (LOCAL OLLAMA - GPU OPTIMIZED, NO STREAMING)
// ------------------------------

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Ollama } = require('ollama');

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

// Chat endpoint with GPU optimization (non-streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const userMessages = req.body.messages || [];

    // Convert messages into a single conversation prompt
    const conversation = userMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const finalPrompt = `${SYSTEM_PROMPT}\n\nConversation:\n${conversation}\n\nA:`;

    console.log("⚡ Sending prompt to local model");

    // Ask Ollama with GPU optimization
    const response = await ollama.generate({
      model: "llama3.1",
      prompt: finalPrompt,
      stream: false,  // No streaming
      options: {
        num_gpu: 1,           // Use GPU (RTX 4050)
        num_thread: 16,       // Ryzen 7 7840HS (8 cores × 2)
        num_ctx: 2048,        // Context window
        num_predict: 200,     // Max response length
        temperature: 0.7,
      },
      keep_alive: "5m"        // Keep model loaded
    });

    console.log("🔥 Ollama Response:", response.response);

    return res.json({ reply: response.response.trim() });

  } catch (error) {
    console.error("❌ OLLAMA SERVER ERROR:", error);
    return res.status(500).json({ error: "Local AI failed" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lava Pizza AI Server running' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Lava Pizza AI LOCAL running on http://localhost:${PORT}`);
  console.log(`🎯 GPU-optimized (RTX 4050 + Ryzen 7 7840HS)`);
});