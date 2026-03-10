import discord
from discord.ext import commands
import importlib
import sys
import os
import brain # นำเข้าไฟล์สมองที่เราจะให้มันเรียนรู้

# --- ตั้งค่าเริ่มต้น ---
TOKEN = os.getenv('DISCORD_TOKEN')
MASTER_ID = 841691286125019186

intents = discord.Intents.all()
bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    print(f'--- น้องเซร่า ร่างเริ่มจาก 0 ออนไลน์แล้วค่ะ ---')
    print(f'Logged in as: {bot.user}')
    print(f'Master ID: {MASTER_ID}')
    print(f'------------------------------------------ 💢')

# --- คำสั่งสอนวิชา (เขียนโค้ดลง brain.py) ---
@bot.command()
async def teach(ctx, *, code_content):
    if ctx.author.id != MASTER_ID:
        return await ctx.send("คุณไม่มีสิทธิ์สอนฉัน! 💢")

    try:
        # บันทึกโค้ดใหม่ลงใน brain.py
        with open("brain.py", "a", encoding="utf-8") as f:
            f.write(f"\n\n{code_content}")
        
        # รีโหลดไฟล์ brain เพื่อให้ใช้คำสั่งใหม่ได้ทันที
        importlib.reload(brain)
        await ctx.send("บรรจุวิชาใหม่ลงในสมองเรียบร้อยค่ะนายท่านน้ำมนต์! 💢")
    except Exception as e:
        await ctx.send(f"การสอนล้มเหลวค่ะ: {e} 💢")

# --- คำสั่งเรียกใช้สิ่งที่สอน ---
@bot.command()
async def do(ctx, func_name, *args):
    if ctx.author.id != MASTER_ID:
        return await ctx.send("ฉันรับฟังคำสั่งแค่นายท่านน้ำมนต์เท่านั้น! 💢")

    try:
        importlib.reload(brain) # ตรวจสอบวิชาล่าสุด
        method = getattr(brain, func_name, None)
        if method:
            if args:
                await method(ctx, *args)
            else:
                await method(ctx)
        else:
            await ctx.send(f"วิชา '{func_name}' หนูยังไม่ได้เรียนเลยค่ะ! 💢")
    except Exception as e:
        await ctx.send(f"เกิดข้อผิดพลาดในการรันวิชา: {e} 💢")

# --- คำสั่งจัดการเซิร์ฟเวอร์พื้นฐาน ---
@bot.command()
@commands.has_permissions(manage_messages=True)
async def clear(ctx, amount: int):
    await ctx.channel.purge(limit=amount + 1)
    await ctx.send(f'จัดการลบให้ {amount} ข้อความแล้วค่ะนายท่าน! 💢', delete_after=5)

bot.run(TOKEN)
