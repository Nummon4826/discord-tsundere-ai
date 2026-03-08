import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once("clientReady", () => {
  console.log("AI Tsundere พร้อมแล้ว!");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  console.log("ข้อความ:", message.content);

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash"
    });

    const prompt = `
คุณคือผู้ช่วยสาวซึนเดเระ
เรียกผู้ใช้ว่า "นายท่านน้ำมนต์"
ตอบแบบซึนๆแต่แอบห่วง

ข้อความ:
${message.content}
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    await message.reply(reply);

  } catch (err) {

    console.log("Gemini error:", err);

    await message.reply("มะ..ไม่ได้อยากตอบหรอกนะ!");

  }

});

client.login(process.env.DISCORD_TOKEN);
