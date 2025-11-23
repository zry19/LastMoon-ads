require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const cron = require('node-cron');
const { createAutoMessageEmbed, createLogEmbed, createHelpEmbed } = require('./embed/embed');
const channelModule = require('./channel');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const version = '3.3.5';

// ========================
// AUTO CREATE DATA FOLDERS & FILES
// ========================
function ensureDataStructure() {
  const times = ['pagi', 'siang', 'malam'];
  const basePath = './data';

  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

  times.forEach(t => {
    const folder = `${basePath}/${t}`;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder);

    const files = [
      `kata_${t}.json`,
      `link_${t}.json`,
      `image_${t}.json`
    ];

    files.forEach(file => {
      const fullPath = `${folder}/${file}`;
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, '[]', 'utf8');
        console.log(`📁 Created missing file: ${fullPath}`);
      }
    });
  });
}

ensureDataStructure();

// load channel data
channelModule.loadChannelData();

// ========================
// Commands loader
// ========================
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command && command.data && command.execute) client.commands.set(command.data.name, command);
  else console.warn(`Command ${file} missing data/execute`);
}

// utils
function randomFromArray(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

// Send scheduled message
async function sendScheduledMessage(timeOfDay) {
  const cd = channelModule.channelData;
  if (!cd.botActive) return;
  if (!cd.autoChannelId) return;

  try {
    const channel = await client.channels.fetch(cd.autoChannelId);
    const pesan = JSON.parse(fs.readFileSync(`./data/${timeOfDay}/kata_${timeOfDay}.json`, 'utf8'));
    const link = JSON.parse(fs.readFileSync(`./data/${timeOfDay}/link_${timeOfDay}.json`, 'utf8'));
    const image = JSON.parse(fs.readFileSync(`./data/${timeOfDay}/image_${timeOfDay}.json`, 'utf8'));
    const msgObj = randomFromArray(pesan);
    const embed = createAutoMessageEmbed({
      title: msgObj.title,
      description: msgObj.text || msgObj.description || '',
      link: Array.isArray(link) && link.length ? randomFromArray(link) : '',
      image: Array.isArray(image) && image.length ? randomFromArray(image) : null
    });
    await channel.send({ content: '@everyone', embeds: [embed] });
  } catch (err) {
    console.error(`Error sending ${timeOfDay} message:`, err);
  }
}

// Cron (server timezone assumed WIB or adjust cron)
cron.schedule('0 7 * * *', () => sendScheduledMessage('pagi'));
cron.schedule('0 13 * * *', () => sendScheduledMessage('siang'));
cron.schedule('0 19 * * *', () => sendScheduledMessage('malam'));

// Ready
client.once('ready', async () => {
  console.log(`Bot login sebagai ${client.user.tag}`);
  channelModule.loadChannelData();
  const cd = channelModule.channelData;
  if (cd.logChannelId) {
    try {
      const ch = await client.channels.fetch(cd.logChannelId);
      const embed = createLogEmbed({ status: 'Online', toggle: cd.botActive, ping: client.ws.ping, uptime: process.uptime(), version });
      await ch.send({ embeds: [embed] });
    } catch (err) {
      console.warn('❌ Channel log invalid, cannot send Online embed:', err.message);
    }
  }
});

// Interaction handler
client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, {
        client,
        channelData: channelModule.channelData,
        saveChannelData: channelModule.saveChannelData,
        setLogChannel: channelModule.setLogChannel,
        setAutoChannel: channelModule.setAutoChannel,
        unsetLogChannel: channelModule.unsetLogChannel,
        unsetAutoChannel: channelModule.unsetAutoChannel,
        createAutoMessageEmbed,
        createLogEmbed,
        createHelpEmbed,
        sendScheduledMessage,
        version
      });
    } catch (err) {
      console.error('Command error:', err);
      if (!interaction.replied) await interaction.reply({ content: 'Terjadi kesalahan!', ephemeral: true });
    }
  }
});

// Modal handling
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  const { customId } = interaction;
  const fields = interaction.fields;

  if (customId === 'modal_addpost') {
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const link = fields.getTextInputValue('link');
    const image = fields.getTextInputValue('image');
    const timeOfDay = (fields.getTextInputValue('time') || 'pagi').toLowerCase();
    try {
      const filePesan = `./data/${timeOfDay}/kata_${timeOfDay}.json`;
      const fileLink = `./data/${timeOfDay}/link_${timeOfDay}.json`;
      const fileImage = `./data/${timeOfDay}/image_${timeOfDay}.json`;

      const arrPesan = JSON.parse(fs.readFileSync(filePesan, 'utf8'));
      const arrLink = JSON.parse(fs.readFileSync(fileLink, 'utf8'));
      const arrImage = JSON.parse(fs.readFileSync(fileImage, 'utf8'));

      arrPesan.push({ title, text: description });
      if (link) arrLink.push(link);
      if (image) arrImage.push(image);

      fs.writeFileSync(filePesan, JSON.stringify(arrPesan, null, 2));
      fs.writeFileSync(fileLink, JSON.stringify(arrLink, null, 2));
      fs.writeFileSync(fileImage, JSON.stringify(arrImage, null, 2));

      await interaction.reply({ content: '✅ Post berhasil ditambahkan!', ephemeral: true });
    } catch (err) {
      console.error('modal_addpost error:', err);
      await interaction.reply({ content: '❌ Gagal menambahkan post!', ephemeral: true });
    }
  }

  if (customId === 'modal_say') {
    const title = fields.getTextInputValue('title');
    const description = fields.getTextInputValue('description');
    const link = fields.getTextInputValue('link');
    const image = fields.getTextInputValue('image');

    const embed = createAutoMessageEmbed({ title, description, link, image });
    const cd = channelModule.channelData;
    try {
      const ch = cd.autoChannelId ? await client.channels.fetch(cd.autoChannelId) : await client.channels.fetch(interaction.channelId);
      await ch.send({ embeds: [embed] });
      await interaction.reply({ content: '✨ Pesan berhasil dikirim!', ephemeral: true });
    } catch (err) {
      console.error('modal_say error:', err);
      await interaction.reply({ content: '❌ Gagal mengirim pesan!', ephemeral: true });
    }
  }
});

// Graceful shutdown
async function sendOfflineEmbedAndExit() {
  const cd = channelModule.channelData;
  if (cd.logChannelId) {
    try {
      const ch = await client.channels.fetch(cd.logChannelId);
      const embed = createLogEmbed({ status: 'Offline', toggle: cd.botActive, ping: client.ws ? client.ws.ping : '-', uptime: process.uptime ? process.uptime() : 0, version });
      await ch.send({ embeds: [embed] });
    } catch (err) {
      console.warn('Gagal kirim offline embed:', err.message);
    }
  }
  process.exit(0);
}

process.on('SIGINT', async () => {
  console.log('CTRL+C detected. Sending offline embed...');
  await sendOfflineEmbedAndExit();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM detected. Sending offline embed...');
  await sendOfflineEmbedAndExit();
});

process.on('uncaughtException', async (err) => {
  console.error('Uncaught exception:', err);
  await sendOfflineEmbedAndExit();
});

client.login(process.env.TOKEN).catch(err => {
  console.error('Login failed:', err);
  process.exit(1);
});
