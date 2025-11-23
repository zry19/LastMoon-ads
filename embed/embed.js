const { EmbedBuilder } = require('discord.js');

function formatWIB() {
  const now = new Date();
  const opts = {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta'
  };
  return now.toLocaleString('id-ID', opts);
}

function createLogEmbed({ status = "Offline", toggle = false, ping = "-", uptime = 0, version = "?" } = {}) {
  const isOnline = String(status).toLowerCase() === 'online';
  const color = isOnline ? '#6b5b95' : '#ff4c4c';

  const header = isOnline
    ? '╔═════════════════════╗\n🌙  BOT ONLINE\n╚═════════════════════╝'
    : '╔═════════════════════╗\n🌙  BOT OFFLINE\n╚═════════════════════╝';

  const embed = new EmbedBuilder()
    .setTitle(header)
    .setDescription(
`Status  : ${isOnline ? 'Active ✅' : 'NonActive ❌'}
Toggle  : ${toggle ? 'Active 🟢' : 'NonActive 🔴'}
Ping    : ${typeof ping === 'number' ? `${ping} ms 📡` : ping}
Uptime  : ${isOnline ? `${Math.floor(uptime/60)} menit ⏱️` : '-'}
Version : ${version}

──────────────────────────
🌌  Waktu Terkirim
${formatWIB()}`
    )
    .setColor(color)
    .setFooter({ text: 'create by @LastMoon_Team' });

  return embed;
}

function createStatusEmbed({ status = 'Offline', toggle = false, ping = '-', uptime = 0, version = '?' } = {}) {
  return createLogEmbed({ status, toggle, ping, uptime, version });
}

function createAutoMessageEmbed({ title = '', description = '', link = '', image = null } = {}) {
  const header = `╔══════════════════════════╗
**${title}**
╚══════════════════════════╝`;

  const embed = new EmbedBuilder()
    .setTitle(header)
    .setDescription(
`${description}

──────────────────────────
${link || ''}`
    )
    .setColor('#6b5b95')
    .setFooter({ text: `🌌 create by @LastMoon_Team | ${formatWIB()}` });

  if (image) embed.setImage(image);
  return embed;
}

function createHelpEmbed(commands) {
  const desc = commands.map(cmd => `**/${cmd.name}**\n${cmd.description}`).join('\n\n');
  return new EmbedBuilder()
    .setTitle('╔═════  🌙 LASTMOON HELP CENTER  ═════╗')
    .setDescription(`\n${desc}\n\n──────────────────────────`)
    .setColor('#6b5b95')
    .setFooter({ text: 'create by @LastMoon_Team' });
}

module.exports = {
  createLogEmbed,
  createStatusEmbed,
  createAutoMessageEmbed,
  createHelpEmbed
};
