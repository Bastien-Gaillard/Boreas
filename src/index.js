const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const fs = require("fs"); 
const config = JSON.parse(fs.readFileSync("./config.json"));
const token = config.token;
const meteoKey = config.meteoKey;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });


let Data = class {
    constructor(city, description,timezone,country,temp) {
        this.city = city;
        this.description = description;
        this.timezone = timezone;
        this.country = country;
        this.temp = temp;
    }
    get city(){ 
        return this._city;
    }
    set city(value){ 
        this._city  = value;
    }
  };


client.on( 'interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'user') {
        var data = weather();
        console.log(data)
        await interaction.reply("zfez");
    }
  });
  

client.login(token);

const weather = function () { 

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=trets&appid=${meteoKey} `)
    .then((reponse) => {
        let newData = new Data(reponse['data']['name'],reponse['data']['weather'][0]['description'],reponse['data']['timezone'],reponse['data']['sys']['country'],reponse['data']['main']['temp']);
        console.log(newData);
        return newData;        
    }).catch((e) => {
        console.log("searchChannels ERROR:", e);
    });
} 
client.once('ready', () => {
	console.log('Ready!');
});
var test = weather();
console.log(test);