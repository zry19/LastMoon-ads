const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('addpost').setDescription('Tambah post ke JSON'),
  async execute(interaction) {
    const modal = new ModalBuilder().setCustomId('modal_addpost').setTitle('Tambah Post ke JSON');

    const titleInput = new TextInputBuilder().setCustomId('title').setLabel('Title (required)').setStyle(TextInputStyle.Short).setRequired(true);
    const descInput = new TextInputBuilder().setCustomId('description').setLabel('Description (required)').setStyle(TextInputStyle.Paragraph).setRequired(true);
    const linkInput = new TextInputBuilder().setCustomId('link').setLabel('Link (optional)').setStyle(TextInputStyle.Short).setRequired(false);
    const imageInput = new TextInputBuilder().setCustomId('image').setLabel('Image URL (optional)').setStyle(TextInputStyle.Short).setRequired(false);
    const timeInput = new TextInputBuilder().setCustomId('time').setLabel('Waktu (pagi/siang/malam)').setStyle(TextInputStyle.Short).setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(descInput),
      new ActionRowBuilder().addComponents(linkInput),
      new ActionRowBuilder().addComponents(imageInput),
      new ActionRowBuilder().addComponents(timeInput)
    );

    await interaction.showModal(modal);
  }
};
