

import fetch from 'node-fetch';
import express from 'express';
import { Telegraf, Markup, Context } from 'telegraf';

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Routes
app.get('/', (req, res) => {
  res.send('All is Ok!!');
});

// Start Express server
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

// Initialize Telegram bot
async function startBot() {
  try {
    const bot = new Telegraf('6502905724:AAHRmaT38BS-QleRlVm9NkZSsmYHKGIL1s8');

     // Command handling
     bot.command('start', (ctx) => ctx.reply('This bot is online.\n\nThis bot is having two ai Gpt and Gemini for using gpt use /gpt and for Gemini use /gemini\n\nNOTE: If bot gets erros then wait for some time and try again.\n'));
     

     bot.command('gpt', async (ctx) => {
       const messageText = ctx.message.text;
       const commandAndArgs = messageText.split(' ');
       const command = commandAndArgs[0];
       const args = commandAndArgs.slice(1);

       if (args.length === 0) {
         return ctx.reply('Please send your prompt to the AI GPT.');
       } else {
         try {
           const response = await fetch(`https://aemt.me/v2/gpt4?text=${encodeURIComponent(args.join(' '))}`);
           const data = await response.json();

           if (data.status) {
             return ctx.reply(data.result);
           } else {
             return ctx.reply('An error occurred while processing your request.');
           }
         } catch (error) {
           console.error('Error processing GPT request:', error);
           return ctx.reply('An error occurred while processing your request.');
         }
       }
     });

    bot.command('gemini',async (ctx) => {
       const messageText = ctx.message.text;
        const commandAndArgs = messageText.split(' ');
        const command = commandAndArgs[0];
        const args = commandAndArgs.slice(1);

        if (args.length === 0) {
          return ctx.reply('Please send your prompt to the AI Gemini.');
        } else {
           var response = await Gemini(args.join(' '))
           return ctx.reply(response)
        }
    });

    // Message handling
    bot.on('message', (ctx) => {
      console.log('Received message:', ctx.message.text);
      // Handle other message types as needed
    });

    // Start bot
    await bot.launch();
    console.log('Bot is now running.');
  } catch (error) {
    console.error('Error starting bot:', error);
    // Retry starting the bot after a delay
    setTimeout(startBot, 5000);
  }
}

// Start bot
startBot();


async function Gemini(prompt) {
    
    const safetySettings = [
        { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" },
        { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
        { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
        { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" }
    ];

    // If there is an error with OpenAI, proceed with Google API
    const apiKey = 'AIzaSyCpB6Zx04WfqdH_0Uyka7cI6tSLk6YsYKk';
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: prompt
                    }
                ]
            }
        ],
        safetySettings
    };

    try {
        let response = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        let data = await response.json();
        const candidates = data.candidates;
        if (candidates && candidates.length > 0) {
            const firstCandidate = candidates[0];
            let resp = firstCandidate.content.parts[0].text;
            console.log('Google', resp);
        }
    } catch (error) {
        console.error('Error:', error);
        resp =  JSON.stringify(data)
    }

    return resp;
}
