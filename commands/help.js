// commands/help.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Menampilkan semua command'),
  async execute(interaction, ctx) {
    const commandsList = [
      { name: 'help', description: 'Menampilkan semua command' },
      { name: 'status', description: 'Menampilkan status bot' },
      { name: 'toggle', description: 'Toggle pesan otomatis' },
      { name: 'post', description: 'Kirim pesan manual (pagi/siang/malam)' },
      { name: 'addpost', description: 'Tambah post ke JSON' },
      { name: 'say', description: 'Kirim pesan manual via modal' },
      { name: 'set-unsetchannel', description: 'Set atau unset channel log/auto' }
    ];
    const embed = ctx.createHelpEmbed ? ctx.createHelpEmbed(commandsList) : null;
    if (embed) await interaction.reply({ embeds: [embed], ephemeral: true });
    else await interaction.reply({ content: 'Help: ' + commandsList.map(c => `/${c.name} - ${c.description}`).join('\n'), ephemeral: true });
  }
};
