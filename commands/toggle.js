const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('toggle').setDescription('Toggle auto post on/off'),
  async execute(interaction, ctx) {
    const { channelData, saveChannelData, createLogEmbed, client, version } = ctx;
    channelData.botActive = !channelData.botActive;
    saveChannelData();

    const embed = createLogEmbed({
      status: client.isReady() ? 'Online' : 'Offline',
      toggle: channelData.botActive,
      ping: client.ws.ping,
      uptime: process.uptime(),
      version
    });

    await interaction.reply({ embeds: [embed], ephemeral: true });
    if (channelData.logChannelId) {
      try { const ch = await client.channels.fetch(channelData.logChannelId); await ch.send({ embeds: [embed] }); } catch (e) { console.warn('toggle log send failed', e.message); }
    }
  }
};
