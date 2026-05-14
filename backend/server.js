const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const aiEndpoint = process.env.AI_API_URL || "https://chat-bot-z3i1.vercel.app/api/generate";

    const response = await axios.post(
      aiEndpoint,
      {
        model: "llama3",
        prompt: message,
        stream: false,
      }
    );

    res.json({
      reply: response.data.response,
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