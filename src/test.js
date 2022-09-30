const { Client, GatewayIntentBits, GuildChannel } = require('discord.js');
const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require("fs"); 
const { channels } = require('discord.js');
const { info, dir } = require('console');
const config = JSON.parse(fs.readFileSync("./config.json"));
const token = config.token;
const meteoKey = config.meteoKey;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});
client.on( 'interactionCreate', async interaction => {
    if (!message.content.startsWith(prefix)) return;
    
    const args = interaction.message.conent.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
    if (command === 'ping') {
		interaction.channel.send('Pong.');
	} else if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}

		message.channel.send(`Command name: ${command}\nArguments: ${args}`);
	}
});
client.login(token);
