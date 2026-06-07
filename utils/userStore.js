const User = require("../models/User");

// 🔍 Get or create user
async function getUser(chatId) {
    let user = await User.findOne({ chatId });

    if (!user) {
        user = await User.create({ chatId });
    }

    return user;
}

// 🔄 Update user
async function updateUser(chatId, data) {
    return await User.findOneAndUpdate(
        { chatId },
        { $set: data },
        { new: true }
    );
}

// 📥 Add to queue
let waitingQueue = [];

function addToQueue(chatId) {
    if (!waitingQueue.includes(chatId)) {
        waitingQueue.push(chatId);
    }
}

// ❌ Remove from queue
function removeFromQueue(chatId) {
    const index = waitingQueue.indexOf(chatId);
    if (index !== -1) {
        waitingQueue.splice(index, 1);
    }
}

// 📤 Get queue
function getQueue() {
    return waitingQueue;
}

module.exports = {
    getUser,
    updateUser,
    addToQueue,
    removeFromQueue,
    getQueue
};