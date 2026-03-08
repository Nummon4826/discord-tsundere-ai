const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const masters = ["nummonrapeewit", "nummon4826"];

client.on("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const isMaster = masters.includes(message.author.username);

  // 👑 คำสั่งนายท่าน

  if (isMaster && message.content === "!kickall") {

    const vc = message.member.voice.channel;

    if (!vc) {
      return message.reply("นายท่านต้องอยู่ในห้องเสียงก่อนสิ... ไม่ได้โง่นะ!");
    }

    vc.members.forEach(member => {
      if (!member.user.bot) {
        member.voice.disconnect();
      }
    });

    return message.reply("ก็ได้ ๆ ข้าเตะทุกคนออกจากห้องให้แล้วนะ นายท่าน!");
  }

  if (isMaster && message.content.startsWith("!kick ")) {

    const member = message.mentions.members.first();

    if (!member) return message.reply("นายท่านต้องแท็กคนก่อนสิ!");

    member.voice.disconnect();

    return message.reply("ข้าเตะเขาออกไปแล้ว... ไม่ได้ทำเพราะห่วงนายท่านหรอกนะ!");
  }

  // 🤖 AI Chat

  try {

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "คุณคือผู้ช่วยสาวซึนเดเระใน Discord คุณเรียกเจ้าของว่า นายท่าน และพูดกวน ๆ ขี้งอนนิด ๆ แต่ก็ช่วยเหลือ"
        },
        {
          role: "user",
          content: message.content
        }
      ]
    });

    message.reply(response.choices[0].message.content);

  } catch (err) {

    console.log(err);
    message.reply("ข้าไม่ว่างตอนนี้หรอกนะ!");

  }

});

client.login(process.env.TOKEN);
