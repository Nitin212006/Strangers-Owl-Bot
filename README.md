# Strangers Owl Bot

A Telegram bot that anonymously connects two random users for temporary one-to-one conversations.

## Features

* Anonymous random user matching
* One-to-one temporary chat sessions
* Search for a new partner using `/next`
* End conversations using `/stop`
* User queue management
* MongoDB integration for user data storage

## Tech Stack

* Node.js
* Telegram Bot API
* MongoDB
* Mongoose

## Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add your Telegram Bot Token

```env
BOT_TOKEN=your_bot_token
```

4. Start MongoDB

5. Run the bot

```bash
node index.js
```

## Commands

* `/start` — Register and begin using the bot
* `/search` — Find a random chat partner
* `/next` — Connect with a different partner
* `/stop` — End the current chat session

## Future Improvements

* MongoDB Atlas integration
* User analytics dashboard
* Gender-based matching
* Interest-based matching
* Admin panel and moderation features
