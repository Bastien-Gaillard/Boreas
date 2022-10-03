//Dependance et import 
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require("fs"); 
const { channels } = require('discord.js');
const config = JSON.parse(fs.readFileSync("./config.json"));
const token = config.token;
const guildId = config.guildId;
const clientId = config.clientId;
const meteoKey = config.meteoKey;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST(({ version: '10'})).setToken(token);
const Data = require("./data");

//Interaction client 
client.on( 'interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    var city;
    var data;
    //Si la commande tapé est 'weather' on appele la fonction weather() et on l'affiche dans un embed
    if (interaction.commandName === 'weather') {
        city = interaction.options.getString('city');
        console.log(city);
        if(city != null){
            try {
                data =  await weather(city);
                if(data == null) return await interaction.reply("An error has occurred"); 
                display(interaction, data);
            } catch (error) {
                console.log(error);
            }  
        } else {
            try {
            city = randomCity();
            data =  await weather(city);
            if(data == null) return await interaction.reply("An error has occurred"); 
            display(interaction, data);
            } catch (error) {
                console.log(error); 
            }
        }
        
    }
});
//On récupere la météo de la ville voulu
const weather = async function (city) { 
    try {
        let request =  await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${meteoKey} `);
        console.log("La reponse est : " + request);
        return new Data(
            request['data']['name'],
            request['data']['weather'][0]['description'],
            request['data']['sys']['country'],
            request['data']['main']['temp'],
            request['data']['main']['feels_like'],
            request['data']['wind']['speed'],
            request['data']['wind']['deg'],
            request['data']['main']['pressure'],
            request['data']['main']['humidity'],
            request['data']['visibility']
        );
    } catch(e){
        console.log("Erreur " + e);
        return null;
    }
} 
const display = async function (interaction, data) { 
    
    var information = "**" + data.city + ", " + data.country + "**" + 
        "\n" + data.celsiusTemp(data.temp) + " °C" + 
        "\n     Feels like " + data.celsiusTemp(data.feels_like) + " °C. " + data.description.charAt(0).toUpperCase() + data.description.slice(1);
    const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setDescription(information)
    .addFields(
        { name: data.wind_speed + "m/s " + data.orientation(data.wind_deg), value: "Humidity: " + data.humidity + "%", inline: true},
        { name: data.pressure + "hPa", value: "Visibility: " + data.visibilityKm(data.visibility) + "km", inline: true },
    );
    interaction.reply({ embeds: [exampleEmbed] });
}
const getCountry = async function () { 
    
    try {
        return await axios.get("https://countriesnow.space/api/v0.1/countries")
        .then((reponse) => {
            //return tous les pays avec leurs villes
            return reponse['data']['data'];
        }).catch((e) => {
            console.log("searchChannels ERROR:", e);
        });
    } catch(e){
        console.log("Erreur " + e);
    }
}
const getCity = async function () { 
    var cities = [];
    var country = await getCountry();
    for(let i = 0; i < country.length; i++){
        cities.push(country[i]['cities'][0]);
        if(cities[i] == undefined){
            cities.splice(i, 1);
        }
    }
    return cities;
}
const randomCity = async function(){
    var cities = await getCity();
    return cities[Math.round( Math.random() * cities.length )];
}
client.once('ready', () => {
	console.log('Ready!');
});

(async ()=>{

    const commands = [
        {
            name: 'weather',
            description: 'Give city weather',
            options: [
              {
                  name: 'city',
                  description: 'the city',
                  type: 3
              }
            ]
        }
    ];
    try {
      console.log('Started refreshing application (/) commands.');
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log('Successfully reloaded application (/) commands.');
    } catch (err) {
      console.log(err);
    }
})()

client.login(token);

