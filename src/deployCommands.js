require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('novoprojeto')
    .setDescription('Cria um canal para um projeto e guarda o link do repositório')
    .addStringOption((option) =>
      option.setName('nome').setDescription('Nome do projeto (vira o nome do canal)').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('link').setDescription('Link do repositório no GitHub').setRequired(true)
    ),
].map((command) => command.toJSON());

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !DISCORD_GUILD_ID) {
  console.error('Defina DISCORD_TOKEN, DISCORD_CLIENT_ID e DISCORD_GUILD_ID no .env antes de rodar este script.');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registrando comandos slash...');
    await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID), { body: commands });
    console.log('Comandos registrados com sucesso.');
  } catch (error) {
    console.error('Falha ao registrar comandos:', error);
    process.exit(1);
  }
})();
