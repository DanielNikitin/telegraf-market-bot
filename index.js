require('dotenv').config();

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

const webAppUrl = 'https://dcg.ee/food';  // web-app

// Обработчик команды /start для начала диалога с пользователем
bot.command('start', async (ctx) => {
  await ctx.reply('Hello! Im a DCG.EE store bot. Click on the button below to go to our web application.', {
      reply_markup: {
          keyboard: [
              [{ text: 'Market', web_app: {url: webAppUrl}}]
              ]
          }
      });
});

// Функция для получения счета на оплату на основе данных из сообщения
const getInvoiceFromMessage = (chatId, message) => {
  // Парсим данные из сообщения
  const { items } = JSON.parse(message.web_app_data.data);
  // Создаем массив товаров для счета
  const prices = items.map(item => ({ 
    label: `${item.name} x${item.quantity}`,
    amount: item.price * item.quantity * 100 // Преобразуем цену в копейки и учитываем количество
  }));
  // Создаем объект счета на оплату
  const invoice = {
    chat_id: chatId,
    provider_token: process.env.PROVIDER_TOKEN,
    start_parameter: 'get_access',
    title: 'DCG.EE ORDER', // Название продукта, 1-32 символа
    description: 'secure card payment', // Описание продукта, 1-255 знаков
    currency: 'EUR', // Трехбуквенный код валюты ISO 4217
    prices: prices, // Преобразуем цену в копейки
    payment_form_title: 'test payment form title',
    payload: {
      unique_id: `${chatId}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN 
    }
  };
  
  return invoice;
};


bot.use(Telegraf.log());

// Обработчик для данных от web-app
bot.on('message', (ctx) => {
  // Проверяем, содержит ли сообщение данные от web-app
  if (ctx.message.web_app_data) {
    // Получаем чат id
    const chatId = ctx.message.chat.id;
    // Получаем счет на оплату на основе данных из сообщения
    const invoice = getInvoiceFromMessage(chatId, ctx.message);
    // Отправляем счет на оплату
    ctx.replyWithInvoice(invoice);
  }
});

// Обработчик для успешного оформления заказа
bot.on('pre_checkout_query', (ctx) => {
  // Ответим подтверждением оформления заказа
  ctx.answerPreCheckoutQuery(true);
});

bot.launch();
console.log("BOT IS RUNNING");
