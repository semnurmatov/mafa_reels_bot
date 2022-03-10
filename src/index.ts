import express from 'express';

import TelegramBot from "node-telegram-bot-api";
import {basicPlan, courseDocsId, greetingsText, noCaptionFile, proPlan, startText, submission, submitted} from "./ITextData";

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
});

const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'С чего начать...', callback_data: 'start' }],
        ]
    }
};

const bot = new TelegramBot(process.env.MAFA_BOT_TOKEN, { polling: true});
bot.on('message', async (mes, metadata?) => {
    console.log("Message: " , mes);
    const chatId = mes.chat.id;

    if(metadata.type !== 'text'){
        console.log('----' + metadata.type);
        const type = metadata.type;
        let username;
        let fileId;
        let sendFile;
        let sendMessage;
        let caption;

        switch (type) {
            case 'photo':
                if(mes.caption === undefined){
                    console.log('22222 ' + mes.caption);
                    
                    await bot.sendMessage(chatId, noCaptionFile, { parse_mode: "Markdown"});
                }else{
                    fileId = mes.photo[mes.photo.length-1].file_id;
                    username = 'Sender username:  @' + mes.chat.username;
                    sendFile = await bot.sendPhoto(courseDocsId, fileId, {caption: caption});
                    sendMessage = await bot.sendMessage(courseDocsId, username);
                    await bot.sendMessage(chatId, submitted);

                }
                break;
            case 'document':
                if(mes.caption === undefined){
                    console.log('11111 ' + mes.caption);

                    await bot.sendMessage(chatId, noCaptionFile, { parse_mode: "Markdown"});
                }else{
                    fileId = mes.document.file_id;
                username = 'Sender username: @' + mes.chat.username;
                sendFile = await bot.sendDocument(courseDocsId, fileId, {caption: caption});
                sendMessage = await bot.sendMessage(courseDocsId, username);
                await bot.sendMessage(chatId, submitted);

                }
                break;
        }

        // const filePath = await bot.getFile(fileId);
        // const fileUrl = `https://api.telegram.org/file/bot${process.env.PUBLIC_GROUP_TOKEN}/`+ filePath.file_path;


        console.log("courseDocsId : ", courseDocsId);
        // await bot.sendMessage(chatId, submitted);
    }else{
        await bot.sendMessage(chatId, greetingsText, options);
    }

});

bot.on('callback_query', async function onCallbackQuery(cbQuery){
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
    }

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
    switch (action){
        case 'start':
            text = startText;
            opts = optsButton;
            break;
        case '1':
            text = basicPlan;
            opts = optsDone;
            break;
        case '2':
            text = proPlan;
            opts = optsDone;
            break;
        case 'submit':
            text = submission;
            opts = optsEmpty;
            break;
    }

    await bot.editMessageText(text, opts);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});


/*
bot.sendMessage(mes.chat.id, "Welcome", {
    "reply_markup": {
        "keyboard": [[{text: 'qwe'}],[{ text: 'some button'}]]
    }
});

*/
