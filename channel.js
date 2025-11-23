const fs = require('fs');
const filePath = './channel.json';

let channelData = {
  logChannelId: null,
  autoChannelId: null,
  botActive: true
};

function loadChannelData(){
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      channelData = Object.assign(channelData, parsed);
    } else {
      fs.writeFileSync(filePath, JSON.stringify(channelData, null, 2));
    }
  } catch(err){
    console.error('Gagal load channel.json:', err);
  }
  return channelData;
}

function saveChannelData(){
  try {
    fs.writeFileSync(filePath, JSON.stringify(channelData, null, 2));
  } catch(err){
    console.error('Gagal save channel.json:', err);
  }
}

function setLogChannel(id){
  channelData.logChannelId = id;
  saveChannelData();
}

function setAutoChannel(id){
  channelData.autoChannelId = id;
  saveChannelData();
}

function unsetLogChannel(){
  channelData.logChannelId = null;
  saveChannelData();
}

function unsetAutoChannel(){
  channelData.autoChannelId = null;
  saveChannelData();
}

module.exports = {
  channelData,
  loadChannelData,
  saveChannelData,
  setLogChannel,
  setAutoChannel,
  unsetLogChannel,
  unsetAutoChannel
};
