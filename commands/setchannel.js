const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Set channel untuk Log atau Auto Post')
    .addStringOption(opt =>
      opt.setName('type')
         .setDescription('Pilih jenis channel: log / auto')
         .setRequired(true)
         .addChoices(
           { name: 'Log Channel', value: 'log' },
           { name: 'Auto Post Channel', value: 'auto' }
         )
    )
    .addChannelOption(opt =>
      opt.setName('channel')
         .setDescription('Pilih channel teks untuk diset')
         .addChannelTypes(ChannelType.GuildText)
         .setRequired(true)
    ),

  async execute(interaction, ctx) {
    const { setLogChannel, setAutoChannel } = ctx;
    const type = interaction.options.getString('type');
    const channel = interaction.options.getChannel('channel');

    if (type === 'log') {
      setLogChannel(channel.id);
      return interaction.reply({ content: `✅ Log channel diset ke ${channel}`, ephemeral: true });
    }

    if (type === 'auto') {
      setAutoChannel(channel.id);
      return interaction.reply({ content: `✅ Auto Post channel diset ke ${channel}`, ephemeral: true });
    }

    return interaction.reply({ content: '❌ Pilihan tidak dikenal.', ephemeral: true });
  }
};
