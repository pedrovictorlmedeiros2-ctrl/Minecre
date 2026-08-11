# Minecre

Bot de Discord que cria um canal para cada projeto e guarda o link do
repositório do GitHub associado a ele.

## Como funciona

- Comando slash `/novoprojeto nome:<nome> link:<link do github>`.
- Cria um canal de texto com o nome do projeto (slugificado).
- Posta uma mensagem no canal com o link do repositório.
- Guarda o vínculo canal ↔ repositório em `data/projects.json`.

## Configuração

1. Crie uma aplicação em https://discord.com/developers/applications e um bot
   nela. Convide o bot para o servidor com permissão de **Gerenciar Canais**.
2. Copie `.env.example` para `.env` e preencha:
   - `DISCORD_TOKEN`: token do bot.
   - `DISCORD_CLIENT_ID`: ID da aplicação.
   - `DISCORD_GUILD_ID`: ID do servidor onde os comandos serão registrados.
   - `PROJECTS_CATEGORY_ID` (opcional): categoria onde os canais de projeto
     serão criados.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Registre o comando slash no servidor:
   ```bash
   npm run deploy-commands
   ```
5. Inicie o bot:
   ```bash
   npm start
   ```

## Uso

No Discord, rode:

```
/novoprojeto nome:Meu Projeto link:https://github.com/usuario/repositorio
```

O bot cria o canal `meu-projeto`, posta o link e guarda o vínculo.
