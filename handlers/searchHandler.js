const {
    getUser,
    updateUser,
    addToQueue,
    removeFromQueue,
    getQueue
} = require("../utils/userStore");

function searchHandler(bot) {
    bot.command("search", async (ctx) => {
        const chatId = ctx.from.id;

        const user = await getUser(chatId);

        // ❌ Setup not complete
        if (!user || user.step !== "done") {
            return ctx.reply("⚠️ Complete setup first using /start");
        }

        // ❌ Already connected
        if (user.isConnected) {
            return ctx.reply("⚠️ You are already connected.");
        }

        // 🔥 Remove self from queue (avoid duplicates)
        removeFromQueue(chatId);

        const queue = getQueue();

        // 🔥 Try to find match
        while (queue.length > 0) {
            const partnerId = queue.shift();

            if (partnerId === chatId) continue;

            const partner = await getUser(partnerId);

            // skip invalid users
            if (!partner || partner.isConnected) continue;

            // ✅ MATCH FOUND

            await updateUser(chatId, {
                isConnected: true,
                partnerId: partnerId,
                isSearching: false
            });

            await updateUser(partnerId, {
                isConnected: true,
                partnerId: chatId,
                isSearching: false
            });

            bot.telegram.sendMessage(chatId, "✅ Connected to a stranger! Say hi 👋");
            bot.telegram.sendMessage(partnerId, "✅ Connected to a stranger! Say hi 👋");

            return;
        }

        // ❌ No match → add to queue
        addToQueue(chatId);

        await updateUser(chatId, {
            isSearching: true
        });

        ctx.reply("⏳ Searching for a stranger...");
    });
}

module.exports = searchHandler;