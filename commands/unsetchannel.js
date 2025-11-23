const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unsetchannel')
    .setDescription('Hapus pengaturan channel log / auto')
    .addStringOption(opt =>
      opt.setName('type')
         .setDescription('Pilih jenis channel yang ingin dihapus')
         .setRequired(true)
         .addChoices(
           { name: 'Log Channel', value: 'log' },
           { name: 'Auto Post Channel', value: 'auto' }
         )
    ),

  async execute(interaction, ctx) {
    const { unsetLogChannel, unsetAutoChannel, channelData } = ctx;
    const type = interaction.options.getString('type');

    if (type === 'log') {
      if (!channelData.logChannelId) return interaction.reply({ content: 'ℹ️ Tidak ada Log Channel yang tersimpan.', ephemeral: true });
      unsetLogChannel();
      return interaction.reply({ content: '🗑️ Log Channel berhasil dihapus.', ephemeral: true });
    }

    if (type === 'auto') {
      if (!channelData.autoChannelId) return interaction.reply({ content: 'ℹ️ Tidak ada Auto Post Channel yang tersimpan.', ephemeral: true });
      unsetAutoChannel();
      return interaction.reply({ content: '🗑️ Auto Post Channel berhasil dihapus.', ephemeral: true });
    }

    return interaction.reply({ content: '❌ Pilihan tidak dikenal.', ephemeral: true });
  }
};
