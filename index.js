require('dotenv').config();
const { Telegraf } = require('telegraf');
const connectDB = require("./config/db");

const startHandler = require('./handlers/startHandler');
const messageHandler = require('./handlers/messageHandler');
const searchHandler = require('./handlers/searchHandler'); // ✅ ADD THIS
const nextStopHandler = require("./handlers/nextStopHandler");

const bot = new Telegraf(process.env.BOT_TOKEN);

// connected my databse
connectDB();
// Attach handlers
startHandler(bot);
searchHandler(bot); 
nextStopHandler(bot);    // ✅ VERY IMPORTANT
messageHandler(bot);


bot.launch();

console.log("Bot is running...");