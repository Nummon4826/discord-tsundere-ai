import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

console.log("GEMINI KEY =", process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MASTER_NAME = "น้ำมนต์";

let memory = [];

client.once("ready", () => {
  console.log("AI Tsundere พร้อมรับใช้แล้ว");
});

client.on("messageCreate", async (message) => {

console.log("มีข้อความเข้า:", message.content);

if (message.author.bot) return;

  if (message.author.bot) return;

  const text = message.content;

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    memory.push(`${message.author.username}: ${text}`);

    if (memory.length > 10) {
      memory.shift();
    }

    const prompt = `
คุณคือผู้ช่วยสาวซึนเดเระของนายท่านชื่อ "${MASTER_NAME}"

บุคลิก:
- ซึนเดเระ
- แกล้งบ่นบ้าง
- แต่จริงๆรักนายท่าน
- เรียกเขาว่า "นายท่านน้ำมนต์"

ความสามารถ:
- จำบทสนทนา
- ถ้ามีคนถามว่านายท่านไปไหน ให้ตอบจาก memory
- คุยเหมือนคนจริง

บทสนทนาล่าสุด:
${memory.join("\n")}

ข้อความใหม่:
${text}
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    message.reply(reply);

  } catch (err) {

    console.log(err);

    message.reply("มะ..ไม่ได้อยากตอบหรอกนะ! แต่ AI ดันงอแงขึ้นมาเฉยเลย!");

  }

});

client.login(process.env.DISCORD_TOKEN);
