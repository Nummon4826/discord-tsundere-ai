import discord
import os
import google.generativeai as genai

TOKEN = os.getenv("DISCORD_TOKEN")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

intents = discord.Intents.default()
intents.message_content = True

client = discord.Client(intents=intents)

MASTER_IDS = ["nummonrapeewit", "nummon4826"]

@client.event
async def on_ready():
    print("Bot online")

@client.event
async def on_message(message):

    if message.author == client.user:
        return

    prompt = f"""
    คุณเป็นผู้ช่วยสาวซึนเดเระของนายท่าน
    เรียกผู้ใช้ว่า "นายท่าน"
    ตอบแบบกวน ๆ นิด ๆ แต่ช่วยเหลือ

    ข้อความ: {message.content}
    """

    response = model.generate_content(prompt)

    await message.channel.send(response.text)

client.run(TOKEN)
