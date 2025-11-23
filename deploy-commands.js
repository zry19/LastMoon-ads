require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

// === VALIDASI ENV ===
if (!process.env.TOKEN) {
    console.error("❌ ERROR: TOKEN tidak ditemukan di .env");
    process.exit(1);
}
if (!process.env.CLIENT_ID) {
    console.error("❌ ERROR: CLIENT_ID tidak ditemukan di .env");
    process.exit(1);
}

// === AMBIL COMMAND FILES ===
const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Cek apakah folder commands ada
if (!fs.existsSync(commandsPath)) {
    console.error("❌ Folder 'commands' tidak ditemukan!");
    process.exit(1);
}

const commandFiles = fs.readdirSync(commandsPath).filter(file =>
    file.endsWith('.js')
);

console.log(`📂 Found ${commandFiles.length} command files.`);

// === LOAD COMMANDS ===
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    try {
        const command = require(filePath);

        if (!command.data || !command.data.toJSON) {
            console.log(`⚠️ SKIPPED (Invalid format): ${file}`);
            continue;
        }

        console.log(`✅ Loaded: ${command.data.name}`);
        commands.push(command.data.toJSON());
    } catch (err) {
        console.log(`❌ Error loading ${file}:`, err.message);
    }
}

// === DEPLOY COMMANDS ===
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`\n🚀 Deploying ${commands.length} slash commands...`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log('🎉 Successfully updated global slash commands!');
    } catch (error) {
        console.error('❌ Error updating slash commands:', error);
    }
})();
