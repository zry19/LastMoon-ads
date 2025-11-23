const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testautopost')
    .setDescription('Test auto-post secara manual')
    .addStringOption(opt =>
      opt.setName('time')
        .setDescription('pagi / siang / malam')
        .setRequired(true)
        .addChoices(
          { name: 'Pagi', value: 'pagi' },
          { name: 'Siang', value: 'siang' },
          { name: 'Malam', value: 'malam' }
        )
    ),

  async execute(interaction, ctx) {
    const time = interaction.options.getString('time');
    await interaction.reply({ content: `⏳ Testing auto-post **${time}**...`, ephemeral: true });

    // Panggil fungsi auto-post asli
    await ctx.sendScheduledMessage(time);
  }
};
