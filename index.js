const {gameOptions, againOptions} = require('./options')

const TelegramApi = require('node-telegram-bot-api')

const token = '7159288090:AAGl1-_N908l74XzNyUSkPg3_UXTAQzvMyI'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загаю Число от 0 до 9, а ты должен его угадать.');
    const randomNumber = Math.floor(Math.random() * 10);  // floor - округления числа
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить личные данные'},
        {command: '/game', description: 'Игра угадай число'},
    ])
    
    bot.on('message', async msg => {
        // Ваш обработчик сообщений здесь
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            isStartCommandReceived = true;
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/8eb/10f/8eb10f4b-8f4f-4958-aa48-80e7af90470a/51.webp');
            return bot.sendMessage(chatId, 'Данный бот работает на JavaScript');
        }
    
        if (text === '/info') {
            const infoText = `Вот твои данные :: ${msg.from.first_name}, ${msg.from.last_name}, ${msg.from.id}`;
            return bot.sendMessage(chatId, infoText);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, выбери один из вариантов в Меню');
    })  

    bot.on('callback_query', async msg => {
        //console.log(msg)
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал число ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Ты не угадал число, бот загадывал ${chats[chatId]}`, againOptions);
        }

        bot.sendMessage(chatId, `Ты выбрал число: ${data}`); // alt 096
    })
}

start()
// Выводим сообщение о том, что бот успешно запущен
console.log('SERVER :: Телеграм бот успешно запущен.');  