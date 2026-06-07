const {
  getUser,
  updateUser,
  addToQueue,
  removeFromQueue,
  getQueue
} = require("../utils/userStore");

function nextStopHandler(bot) {

  // 🔁 NEXT COMMAND
  bot.command("next", async (ctx) => {
    const userId = ctx.from.id;

    const user = await getUser(userId);

    if (!user || !user.isConnected) {
      return ctx.reply("❌ You are not connected to anyone.");
    }

    const partnerId = user.partnerId;
    const partner = await getUser(partnerId);

    // 🔥 DISCONNECT BOTH
    await updateUser(userId, {
      isConnected: false,
      partnerId: null
    });

    if (partner) {
      await updateUser(partnerId, {
        isConnected: false,
        partnerId: null
      });

      try {
        await bot.telegram.sendMessage(
          partnerId,
          "⚠️ Stranger skipped the chat. Use /search to find a new one."
        );
      } catch (err) {
        console.log(err.message);
      }
    }

    // 🔥 ADD CURRENT USER BACK TO QUEUE
    removeFromQueue(userId);
    addToQueue(userId);

    await updateUser(userId, {
      isSearching: true
    });

    await ctx.reply("🔎 Searching for a new partner...");

    // 🔥 MATCH AGAIN
    const queue = getQueue();

    while (queue.length > 1) {
      const u1 = queue.shift();
      const u2 = queue.shift();

      if (!u1 || !u2 || u1 === u2) continue;

      const user1 = await getUser(u1);
      const user2 = await getUser(u2);

      if (!user1 || !user2) continue;

      await updateUser(u1, {
        isConnected: true,
        partnerId: u2,
        isSearching: false
      });

      await updateUser(u2, {
        isConnected: true,
        partnerId: u1,
        isSearching: false
      });

      bot.telegram.sendMessage(u1, "✅ Connected to a stranger!");
      bot.telegram.sendMessage(u2, "✅ Connected to a stranger!");

      break;
    }
  });


  // 🛑 STOP COMMAND
  bot.command("stop", async (ctx) => {
    const userId = ctx.from.id;

    const user = await getUser(userId);

    if (!user) return;

    if (user.isConnected) {
      const partnerId = user.partnerId;
      const partner = await getUser(partnerId);

      await updateUser(userId, {
        isConnected: false,
        partnerId: null
      });

      if (partner) {
        await updateUser(partnerId, {
          isConnected: false,
          partnerId: null
        });

        try {
          await bot.telegram.sendMessage(
            partnerId,
            "❌ Stranger has ended the chat."
          );
        } catch (err) {
          console.log(err.message);
        }
      }
    }

    // 🔥 REMOVE FROM QUEUE
    removeFromQueue(userId);

    await updateUser(userId, {
      isSearching: false
    });

    await ctx.reply("🛑 You stopped the chat. Use /search to start again.");
  });

}

module.exports = nextStopHandler;