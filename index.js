const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔥 anti spam
const userSpam = new Map();
const toxicCooldown = new Map();

client.once('clientReady', () => {
  console.log(`😈 Bot online: ${client.user.tag}`);
});

// 🔥 Slash commands
client.on('interactionCreate', async (i) => {
  if (!i.isChatInputCommand()) return;

  if (i.commandName === 'roll') {
    const num = Math.floor(Math.random() * 100) + 1;
    return i.reply(`🎲 Bạn quay được: **${num}**`);
  }

  if (i.commandName === 'coinflip') {
    const r = Math.random() < 0.5 ? 'Ngửa' : 'Sấp';
    return i.reply(`🪙 Kết quả: **${r}**`);
  }

  if (i.commandName === '8ball') {
    const answers = ['Có','Không','Hên xui 😄','Chắc chắn','Không bao giờ'];
    return i.reply(`🔮 ${answers[Math.floor(Math.random()*answers.length)]}`);
  }

  if (i.commandName === 'meme') {
    const memes = ['Học đi 😡','Ngủ đi 😴','Game là phụ 😎','Ping boss chưa 🤨'];
    return i.reply(`😂 ${memes[Math.floor(Math.random()*memes.length)]}`);
  }

  if (i.commandName === 'rps') {
    const choices = ['búa','kéo','bao'];
    return i.reply(`🤖 Bot chọn: **${choices[Math.floor(Math.random()*3)]}**`);
  }
});

// 🔥 Anti spam + toxic
client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;

  const userId = msg.author.id;
  const now = Date.now();

  if (!userSpam.has(userId)) userSpam.set(userId, []);

  const times = userSpam.get(userId);
  times.push(now);

  const filtered = times.filter(t => now - t <= 3000);
  userSpam.set(userId, filtered);

  if (filtered.length > 2) {
    if (toxicCooldown.has(userId) && now - toxicCooldown.get(userId) < 5000) return;

    toxicCooldown.set(userId, now);

     const toxic = [
      'spam gì lắm thế 😏',
      'bình tĩnh nào bro 🤡',
      'gõ chậm lại coi 😑',
      'chat như 36 vậy 😭'
    ];

    msg.reply(toxic[Math.floor(Math.random()*toxic.length)]);
  }
});

// 🔥 LOGIN bằng ENV (Render)
client.login(process.env.TOKEN);
