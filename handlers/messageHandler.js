const { getUser, updateUser } = require("../utils/userStore");

function messageHandler(bot) {

    bot.on("message", async (ctx) => {
        try {
            const chatId = ctx.from.id;
            const message = ctx.message;

            const user = await getUser(chatId);

            // 🔥 If connected → forward everything
            if (user.isConnected && user.partnerId) {
                const partnerId = user.partnerId;

                // TEXT
                if (message.text && !message.text.startsWith("/")) {
                    return bot.telegram.sendMessage(partnerId, message.text);
                }

                // PHOTO
                if (message.photo) {
                    const fileId = message.photo[message.photo.length - 1].file_id;
                    return bot.telegram.sendPhoto(partnerId, fileId, {
                        caption: message.caption || ""
                    });
                }

                // STICKER
                if (message.sticker) {
                    return bot.telegram.sendSticker(partnerId, message.sticker.file_id);
                }

                // VIDEO
                if (message.video) {
                    return bot.telegram.sendVideo(partnerId, message.video.file_id, {
                        caption: message.caption || ""
                    });
                }

                // VOICE
                if (message.voice) {
                    return bot.telegram.sendVoice(partnerId, message.voice.file_id);
                }

                // DOCUMENT
                if (message.document) {
                    return bot.telegram.sendDocument(partnerId, message.document.file_id);
                }

                return;
            }

            // 🔽 ONBOARDING FLOW (only if not connected)

            if (message.text) {
                const text = message.text;

                if (text.startsWith("/")) return;

                if (user.step === "gender") {
                    await updateUser(chatId, {
                        gender: text,
                        step: "name"
                    });
                    return ctx.reply("Enter your name:");
                }

                if (user.step === "name") {
                    await updateUser(chatId, {
                        name: text,
                        step: "age"
                    });
                    return ctx.reply("Enter your age:");
                }

                if (user.step === "age") {
                    await updateUser(chatId, {
                        age: text,
                        step: "done"
                    });
                    return ctx.reply("✅ Setup complete!\n\nUse /search to find someone.");
                }
            }

        } catch (err) {
            console.error("MESSAGE HANDLER ERROR:", err);
        }
    });

}

module.exports = messageHandler;