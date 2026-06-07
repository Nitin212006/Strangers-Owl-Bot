const { getUser, updateUser } = require("../utils/userStore");

function startHandler(bot) {
    bot.start(async (ctx) => {
        const chatId = ctx.from.id;

        const user = await getUser(chatId);

        // reset user
        await updateUser(chatId, {
            step: "gender",
            isSearching: false,
            isConnected: false,
            partnerId: null
        });

        ctx.reply(
            "Welcome to Strangers Owl 🦉\n\nSelect your gender:",
            {
                reply_markup: {
                    keyboard: [
                        ["Male", "Female"],
                        ["Bi", "Prefer not to say"]
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        );
    });
}

module.exports = startHandler;