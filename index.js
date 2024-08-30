
const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '6874076326:AAHrQxJs8jZzZc6O2lU3h6X2MSxPSwdHJfI';
const bot = new TelegramBot(TOKEN, {
    polling: true
});

bot.on('text', async msg => {
    await bot.sendMessage(msg.chat.id, 'Привет')
});