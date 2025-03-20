require("dotenv").config();
const express = require("express");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(express.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

// AI Chatbot URL (Modify this if needed)
const CHATBOT_URL = "https://myaibot-ten.vercel.app";

// Handle incoming Telegram messages
app.post("/webhook", async (req, res) => {
    const message = req.body.message;
    if (!message || !message.text) {
        return res.sendStatus(200);
    }

    const chatId = message.chat.id;
    const userMessage = message.text;

    try {
        // Send the user message to your AI chatbot
        const response = await axios.get(`${CHATBOT_URL}/api/getResponse?message=${encodeURIComponent(userMessage)}`);

        // Send chatbot response back to Telegram
        bot.sendMessage(chatId, response.data);
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't process your request. Please try again.");
        console.error("Error fetching chatbot response:", error);
    }

    res.sendStatus(200);
});

// Start Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
