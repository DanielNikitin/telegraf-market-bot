require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const webAppUrl = 'https://api.dcg.ee/dashboard';

// Обработчик команды /start для начала диалога с пользователем
bot.command('start', async (ctx) => {
  await ctx.reply('Menthal Condition FOR BRO. Click on the button below to go to our web application.', {
      reply_markup: {
          keyboard: [
              [{ text: 'LOGIN', web_app: {url: webAppUrl}}]
              ]
          }
      });
});

bot.use(Telegraf.log());

bot.launch();
console.log("BOT IS RUNNING");
