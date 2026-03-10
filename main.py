import discord
from discord.ext import commands
import os
import importlib

# --- ดึง Token จาก Railway (นายท่านต้องไปใส่ในแถบ Variables นะคะ!) ---
TOKEN = os.getenv('DISCORD_TOKEN')

# --- ยืนยันตัวตนนายท่านน้ำมนต์คนเดียวเท่านั้น ---
MASTER_ID = 841691286125019186 

intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'✅ น้องเซร่าร่าง 0 พร้อมรับใช้ "นายท่านน้ำมนต์" แล้วค่ะ!')
    print(f'🔒 ระบบล็อกไอดี: {MASTER_ID} (เรียนรู้จากนายท่านคนเดียวเท่านั้น 💢)')

# --- คำสั่ง "สอนวิชา" (เขียนลงไฟล์ brain.py) ---
@bot.command()
async def teach(ctx, *, code_content):
    if ctx.author.id != MASTER_ID:
        return await ctx.send("คุณไม่ใช่ 'นายท่านน้ำมนต์' ของฉัน! อย่ามาสั่งนะ! 💢")
    
    try:
        with open("brain.py", "a", encoding="utf-8") as f:
            f.write(f"\n\n{code_content}")
        await ctx.send("รับทราบค่ะ บรรจุวิชาใหม่ลงสมองเรียบร้อย! 💢")
    except Exception as e:
        await ctx.send(f"สอนพลาดค่ะนายท่าน: {e} 💢")

# --- คำสั่ง "เรียกใช้วิชาที่สอน" ---
@bot.command()
async def do(ctx, func_name, *args):
    if ctx.author.id != MASTER_ID:
        return await ctx.send("ฉันรับคำสั่งแค่จากนายท่านคนเดียวเท่านั้นค่ะ! 💢")
    
    try:
        import brain
        importlib.reload(brain)
        method = getattr(brain, func_name, None)
        if method:
            if args:
                await method(ctx, *args)
            else:
                await method(ctx)
        else:
            await ctx.send(f"วิชา '{func_name}' หนูยังไม่ได้เรียนเลยค่ะนายท่าน! 💢")
    except Exception as e:
        await ctx.send(f"รันวิชาพลาดค่ะ: {e} 💢")

bot.run(TOKEN)
