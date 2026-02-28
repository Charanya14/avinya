const axios = require("axios");

const chatWithAI = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Messages array is required" });
        }

        const groqApiKey = process.env.GROQ_API_KEY;
        if (!groqApiKey) {
            console.error("GROQ_API_KEY is not defined in .env");
            return res.status(500).json({ error: "AI Service is not configured properly." });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            },
            {
                headers: {
                    Authorization: `Bearer ${groqApiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate AI response." });
    }
};

module.exports = {
    chatWithAI
};
