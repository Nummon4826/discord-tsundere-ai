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

client.once("ready", () => {
  console.log("Bot online");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
คุณคือผู้ช่วยสาวซึนเดเระของนายท่าน
เรียกผู้ใช้ว่านายท่าน
ตอบแบบซึน ๆ แต่ช่วยเหลือ

ข้อความ: ${message.content}
`;

  const result = await model.generateContent(prompt);
  const reply = result.response.text();

  message.reply(reply);

});

client.login(process.env.DISCORD_TOKEN);
