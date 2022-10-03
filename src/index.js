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
const rest = new REST(({ version: '10' })).setToken(token);
const Data = require("./data");

//Interaction client
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    var city;
    var data;
    //Si la commande tapé est 'weather' on appele la fonction weather() et on l'affiche dans un embed
    if (interaction.commandName === 'weather') {
		await interaction.deferReply();
        city = interaction.options.getString('city');
        console.time("timer");
        if (city != null) {
            try {
                data = await weather(city);
                if (typeof data == "string" || data == null || typeof data == "undefined") return await interaction.editReply(data || "An error has occurred");
                await display(interaction, data);
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                city = await randomCity();
                data = await weather(city);
                if (typeof data == "string" || data == null || typeof data == "undefined") return await interaction.editReply(data || "An error has occurred");
                await display(interaction, data);
            } catch (e) {
                console.log(e);
            }
        }
        console.timeEnd("timer");
    }
});
//On récupere la météo de la ville voulu
const weather = async function (city) {
    try {
        let request = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${meteoKey} `);
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
    } catch (e) {
        console.error("Erreur", e.response?.data?.message);
        return e.response?.data?.message;
    }
}
const display = async function (interaction, data) {
    var information = "**" + data.city + ", " + data.country + "**" +
        "\n" + data.celsiusTemp(data.temp) + " °C" +
        "\n     Feels like " + data.celsiusTemp(data.feels_like) + " °C. " + data.description.charAt(0).toUpperCase() + data.description.slice(1);
    try {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(information)
            .addFields(
                { name: data.wind_speed + "m/s " + data.orientation(data.wind_deg), value: "Humidity: " + data.humidity + "%", inline: true },
                { name: data.pressure + "hPa", value: "Visibility: " + data.visibilityKm(data.visibility) + "km", inline: true },
            );
        await interaction.editReply({ embeds: [exampleEmbed] });
    } catch (e) {
        console.error("L'erreur est", e)
    }

}

const getCountries = async function () {
    try {
        let request = await axios.get("https://countriesnow.space/api/v0.1/countries");
        // console.log("La reponse est : ", request);
        return request.data.data;
    } catch (e) {
        console.error("Erreur", e);
    }
}
const getCities = async function () {
    var allCitites = [];
    var countries = await getCountries();
    countries.forEach(country => {
        if (country['cities'] != undefined) {
            country['cities'].forEach(city => {
                allCitites.push(city);
            });
        }
    });
    return allCitites;
}
var last = (Date.now() / 1000 / 60);
var cities = [];
const getCache = async function () {
    if((Date.now() / 1000 / 60) - last >= 0.4){
        last = (Date.now() / 1000 / 60);
        console.log("Trop vieux"); 
        cities = await getCities();
    }
    return cities;
}
const randomCity = async function () {
    let cities = await getCache();
    return cities[Math.round(Math.random() * cities.length)];
}
client.once('ready', () => {
    console.log('Ready!');
});

(async () => {
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
        cities = await getCities();
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