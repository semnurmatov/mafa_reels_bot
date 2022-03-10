import TelegramBot from "node-telegram-bot-api";
import {basicPlan, courseDocsId, greetingsText, proPlan, startText, submission} from "./ITextData";

require('dotenv').config();

const options = {
    reply_markup: {
        inline_keyboard: [
            [{ text: 'С чего начать...', callback_data: 'start' }],
        ]
    }
};

const bot = new TelegramBot(process.env.PUBLIC_GROUP_TOKEN, { polling: true});
bot.on('message', async (mes, metadata?) => {
    console.log("Message: " , mes);
    const chatId = mes.chat.id;
    const caption = mes.caption;

    if(metadata.type !== 'text'){
        console.log('----' + metadata.type);
        const type = metadata.type;
        let fileId;
        let sendFile;

        switch (type) {
            case 'photo':
                fileId = mes.photo[mes.photo.length-1].file_id;
                sendFile = await bot.sendPhoto(courseDocsId, fileId, {caption: caption});
                break;
            case 'document':
                fileId = mes.document.file_id;
                sendFile = await bot.sendDocument(courseDocsId, fileId, {caption: caption});
                break;
        }

        // const filePath = await bot.getFile(fileId);
        // const fileUrl = `https://api.telegram.org/file/bot${process.env.PUBLIC_GROUP_TOKEN}/`+ filePath.file_path;


        console.log("courseDocsId : ", courseDocsId);
        await bot.sendMessage(chatId, sendFile.caption);
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


// bot.on('message', async (mes, metadata) => {
//     console.log(mes);
//     const cahtId = mes.chat.id;
//     const type = metadata.type;
//     const options = {
//         reply_markup: {
//             inline_keyboard: [
//                 [{ text: 'С чего начать...', callback_data: 'start' }],
//             ]
//         }
//     };
//
//     await bot.sendMessage(cahtId, greetingsText, options);
// });

/*
bot.sendMessage(mes.chat.id, "Welcome", {
    "reply_markup": {
        "keyboard": [[{text: 'qwe'}],[{ text: 'some button'}]]
    }
});

*/
