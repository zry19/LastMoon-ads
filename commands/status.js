const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('status').setDescription('Show bot status'),
  async execute(interaction, ctx) {
    const { createLogEmbed, client, channelData, version } = ctx;
    const embed = createLogEmbed({
      status: client.isReady() ? 'Online' : 'Offline',
      toggle: channelData.botActive,
      ping: client.ws.ping,
      uptime: process.uptime(),
      version
    });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
