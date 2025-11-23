async function sendScheduledMessage(timeOfDay) {
  const cd = channelModule.channelData;
  if (!cd.botActive) return;
  if (!cd.autoChannelId) return;

  try {
    const channel = await client.channels.fetch(cd.autoChannelId);

    let pesanFile, linkFile, imageFile;

    if (timeOfDay === "pagi") {
      pesanFile = "./text/txtmorn.json";
      linkFile  = "./text/link.json";
      imageFile = "./image/pagi.json";
    }

    if (timeOfDay === "siang") {
      pesanFile = "./text/txtnoon.json";
      linkFile  = "./text/link.json";
      imageFile = "./image/siang.json";
    }

    if (timeOfDay === "malam") {
      pesanFile = "./text/txteven.json";
      linkFile  = "./text/link.json";
      imageFile = "./image/malam.json";
    }

    const pesan = JSON.parse(fs.readFileSync(pesanFile, 'utf8'));
    const link = JSON.parse(fs.readFileSync(linkFile, 'utf8'));
    const image = JSON.parse(fs.readFileSync(imageFile, 'utf8'));

    const msgText = randomFromArray(pesan);
    const msgLink = randomFromArray(link);
    const img = randomFromArray(image);

    const embed = createAutoMessageEmbed({
      title: `Selamat ${timeOfDay}!`,
      description: msgText,
      link: msgLink,
      image: img
    });

    await channel.send({ content: '@everyone', embeds: [embed] });

  } catch (err) {
    console.error(`Error sending ${timeOfDay} message:`, err);
  }
}
