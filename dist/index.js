"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const ITextData_1 = require("./ITextData");
require('dotenv').config();
const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'С чего начать...', callback_data: 'start' }],
        ]
    }
};
const bot = new node_telegram_bot_api_1.default(process.env.MAFA_BOT_TOKEN, { polling: true });
bot.on('message', async (mes, metadata) => {
    console.log("Message: ", mes);
    const chatId = mes.chat.id;
    const caption = mes.caption;
    if (metadata.type !== 'text') {
        console.log('----' + metadata.type);
        const type = metadata.type;
        let fileId;
        let sendFile;
        switch (type) {
            case 'photo':
                fileId = mes.photo[mes.photo.length - 1].file_id;
                sendFile = await bot.sendPhoto(ITextData_1.courseDocsId, fileId, { caption: caption });
                break;
            case 'document':
                fileId = mes.document.file_id;
                sendFile = await bot.sendDocument(ITextData_1.courseDocsId, fileId, { caption: caption });
                break;
        }
        console.log("courseDocsId : ", ITextData_1.courseDocsId);
        await bot.sendMessage(chatId, sendFile.caption);
    }
    else {
        await bot.sendMessage(chatId, ITextData_1.greetingsText, options);
    }
});
bot.on('callback_query', async function onCallbackQuery(cbQuery) {
    const action = cbQuery.data;
    const msg = cbQuery.message;
    let optsEmpty = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
    };
    let optsDone = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Подтверждение...', callback_data: 'submit' }],
            ]
        }
    };
    const optsButton = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Тариф 1', callback_data: '1' }],
                [{ text: 'Тариф 2', callback_data: '2' }],
            ]
        }
    };
    let text;
    let opts;
    switch (action) {
        case 'start':
            text = ITextData_1.startText;
            opts = optsButton;
            break;
        case '1':
            text = ITextData_1.basicPlan;
            opts = optsDone;
            break;
        case '2':
            text = ITextData_1.proPlan;
            opts = optsDone;
            break;
        case 'submit':
            text = ITextData_1.submission;
            opts = optsEmpty;
            break;
    }
    await bot.editMessageText(text, opts);
});
//# sourceMappingURL=index.js.map