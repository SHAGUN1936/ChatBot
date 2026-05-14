const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post(["/chat", "/_/backend/chat", "/api/chat"], async (req, res) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.GROQ_API_KEY || process.env.AI_API_KEY || "";
    
    let replyText = "";

    if (!apiKey) {
      // Fallback to a free, no-key AI API if the user hasn't set up Groq
      const response = await axios.post("https://text.pollinations.ai/", {
        messages: [{ role: "user", content: message }]
      });
      replyText = response.data;
    } else {
      const aiEndpoint = process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
      const response = await axios.post(
        aiEndpoint,
        {
          model: "llama3-8b-8192", 
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      replyText = response.data.choices[0].message.content;
    }

    res.json({
      reply: replyText,
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