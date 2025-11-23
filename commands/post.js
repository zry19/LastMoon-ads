const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('post')
    .setDescription('Kirim auto post sekarang berdasarkan waktu')
    .addStringOption(o =>
      o.setName('waktu')
        .setDescription('Pilih waktu post yang ingin dikirim')
        .setRequired(true)
        .addChoices(
          { name: 'Pagi', value: 'pagi' },
          { name: 'Siang', value: 'siang' },
          { name: 'Malam', value: 'malam' }
        )
    ),

  async execute(interaction, ctx) {
    const waktu = interaction.options.getString('waktu');
    const { sendScheduledMessage, channelData } = ctx;

    if (!channelData.autoChannelId)
      return interaction.reply({ content: '❌ Auto Post Channel belum diset.', ephemeral: true });

    await sendScheduledMessage(waktu);
    await interaction.reply({ content: `✅ Pesan ${waktu} berhasil dikirim!`, ephemeral: true });
  }
};
