require('dotenv').config();
const { Client, GatewayIntentBits, ChannelType, EmbedBuilder } = require('discord.js');
const { addProject } = require('./store');

const { DISCORD_TOKEN, PROJECTS_CATEGORY_ID } = process.env;

if (!DISCORD_TOKEN) {
  console.error('Defina DISCORD_TOKEN no .env antes de iniciar o bot.');
  process.exit(1);
}

function slugifyChannelName(name) {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 90) || 'projeto'
  );
}

function isValidRepoUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com';
  } catch {
    return false;
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'novoprojeto') return;

  const nome = interaction.options.getString('nome', true);
  const link = interaction.options.getString('link', true);

  if (!isValidRepoUrl(link)) {
    await interaction.reply({ content: 'O link precisa ser uma URL válida do GitHub (https://github.com/...).', ephemeral: true });
    return;
  }

  if (!interaction.guild) {
    await interaction.reply({ content: 'Este comando só funciona dentro de um servidor.', ephemeral: true });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const channel = await interaction.guild.channels.create({
      name: slugifyChannelName(nome),
      type: ChannelType.GuildText,
      parent: PROJECTS_CATEGORY_ID || undefined,
      topic: link,
      reason: `Canal de projeto criado por ${interaction.user.tag}`,
    });

    addProject({
      channelId: channel.id,
      name: nome,
      repoUrl: link,
      guildId: interaction.guild.id,
    });

    const embed = new EmbedBuilder()
      .setTitle(nome)
      .setURL(link)
      .setDescription(`Repositório: ${link}`)
      .setColor(0x2f81f7);

    await channel.send({ embeds: [embed] });
    await interaction.editReply({ content: `Canal ${channel} criado para o projeto **${nome}**.` });
  } catch (error) {
    console.error('Erro ao criar canal do projeto:', error);
    await interaction.editReply({ content: 'Não consegui criar o canal. Verifique as permissões do bot e tente de novo.' });
  }
});

client.login(DISCORD_TOKEN);
