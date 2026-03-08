import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("GEMINI KEY =", process.env.GEMINI_API_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MASTER_NAME = "น้ำมนต์";

let memory = [];

client.once("clientReady", () => {
  console.log("AI Tsundere พร้อมรับใช้แล้ว");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  console.log("มีข้อความเข้า:", message.content);

  const text = message.content;

  try {

    console.log("กำลังเรียก Gemini...");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 40
      }
    });

    memory.push(`${message.author.username}: ${text}`);

    if (memory.length > 10) {
      memory.shift();
    }

    const prompt = `
คุณคือผู้ช่วยสาวซึนเดเระของนายท่านชื่อ "${MASTER_NAME}"

บุคลิก:
- ซึนเดเระ
- แกล้งบ่น
- แต่จริงๆเป็นห่วง
- เรียกเขาว่า "นายท่านน้ำมนต์"

กฎการตอบ:
- อย่าตอบซ้ำ
- คุยเหมือนมนุษย์
- ใช้บริบทจากบทสนทนา

บทสนทนาก่อนหน้า:
${memory.join("\n")}

ข้อความล่าสุด:
${text}
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    console.log("Gemini ตอบแล้ว");

    await message.reply(reply);

  } catch (error) {

    console.log("Gemini error:", error);

    await message.reply("มะ..ไม่ได้อยากตอบหรอกนะ! แต่ AI ดันงอแงขึ้นมาเฉยเลย!");

  }

});

client.login(process.env.DISCORD_TOKEN);
