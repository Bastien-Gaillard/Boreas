const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require("fs"); 
const config = JSON.parse(fs.readFileSync("./config.json"));
const token = config.token;
const meteoKey = config.meteoKey;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;    
    if (commandName === 'user') {
        weather();
		await interaction.reply("sfzf");
	}
});

client.login(token);
const weather = function () { 
    axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=22.7196&lon=75.8577&appid=${meteoKey} `)
    .then((response) => {
        return response;
    }).catch((e) => {
        console.log("searchChannels ERROR:", e);
    });
} 