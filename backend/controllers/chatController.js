// backend/controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.sendMessageToAI = async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Server Error: GEMINI_API_KEY is missing." });
  }

  try {
    const { message, history } = req.body;

    // Active model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
    
    // Safely clean the history so Gemini doesn't crash on the first message
    let safeHistory = history || [];
    if (safeHistory.length > 0 && safeHistory[0].role === 'model') {
      safeHistory.shift(); 
    }

    // Start Chat
    const chat = model.startChat({
      history: safeHistory,
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // Send Message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const aiText = response.text();

    res.json({ reply: aiText });

  } catch (error) {
    console.error("🔥 Gemini Error:", error.message || error);
    
    // Detect Quota / 429 Errors specifically
    if (error.status === 429 || (error.message && error.message.includes('429')) || (error.message && error.message.includes('Quota'))) {
      return res.status(429).json({ error: "Limit exceeded" });
    }

    // Generic server error
    res.status(500).json({ error: "AI Error: " + (error.message || "Unknown error") });
  }
};