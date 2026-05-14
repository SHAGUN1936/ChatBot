const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post(["/chat", "/_/backend/chat", "/api/chat"], async (req, res) => {
  try {
    const { message } = req.body;

    const aiEndpoint = process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
    const apiKey = process.env.GROQ_API_KEY|| process.env.AI_API_KEY || "";

    const response = await axios.post(
      aiEndpoint,
      {
        model: "llama3-8b-8192", // Groq's free LLaMA-3 model name
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// Export the app for Vercel Serverless
module.exports = app;

// Only listen if not running in a serverless environment
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}