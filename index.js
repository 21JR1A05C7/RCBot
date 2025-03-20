require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Use the new token you generated from BotFather
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Your chatbot's frontend URL
const CHATBOT_URL = "https://myaibot-ten.vercel.app";

// Handle incoming messages
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
        // Forward the message to your chatbot's API (Modify this if needed)
        const response = await axios.get(`${CHATBOT_URL}/api/getResponse?message=${encodeURIComponent(userMessage)}`);

        // Send the chatbot's response to the Telegram user
        bot.sendMessage(chatId, response.data);
    } catch (error) {
        bot.sendMessage(chatId, "Sorry, I couldn't process your request. Please try again.");
        console.error(error);
    }
});

// Start Express server (optional, useful for hosting)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
