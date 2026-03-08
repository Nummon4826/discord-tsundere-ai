const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
 intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
 ]
});

client.on("ready", ()=>{
 console.log("ผู้ช่วยซึนเดเระออนไลน์แล้ว!");
});

client.on("messageCreate", msg => {

 if(msg.author.bot) return;

 if(msg.content === "สวัสดี"){
  msg.reply("สะ...สวัสดี! อย่าคิดว่าฉันดีใจที่นายทักนะ!");
 }

});

client.login(process.env.TOKEN);
