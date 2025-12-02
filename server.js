// ------------------------------
// Lava Pizza Local AI Server (Ollama)
// ------------------------------

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Full path to ollama.exe — FIX FOR WINDOWS
const OLLAMA_PATH = `"C:\\Users\\sdeep\\AppData\\Local\\Programs\\Ollama\\ollama.exe"`;

// System prompt
const SYSTEM_PROMPT = `
You are Lava, the friendly pizza assistant for Lava Pizza YYC in Calgary.
You help customers with menu questions, toppings, deals, and pizza recommendations.
Keep answers short, friendly, fun, and helpful.
If unsure, say you are not sure.
`;

app.post('/api/chat', async (req, res) => {
  const userMessages = req.body.messages || [];

  const prompt = `
${SYSTEM_PROMPT}

Conversation:
${userMessages.map(m => `${m.role}: ${m.content}`).join("\n")}

Assistant:
`;

  console.log("Sending to Ollama →", prompt);

  // 🚀 Use full path to Ollama.exe
  const command = `${OLLAMA_PATH} run llama3.2 "${prompt}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Ollama exec error:", err);
      return res.status(500).json({ error: "Local AI failed to respond" });
    }

    console.log("Ollama Output →", stdout);
    res.json({ reply: stdout.trim() });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🔥 Lava Pizza AI (local) running on http://localhost:${PORT}`);
});
