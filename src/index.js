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
const { userInfo } = require('os');

//Interaction client
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    //Si la commande tapé est 'weather' on appele la fonction weather() et on l'affiche dans un embed
    if (interaction.commandName === 'weather') {
        await interaction.deferReply();
        var city = interaction.options.getString('city');;
        var data;

        if (city != null) {
            try {
                data = await weather(city);
                if (typeof data == "string" || data == null || typeof data == "undefined") return await interaction.editReply(displayError(interaction, data) || "An error has occurred");
                await display(interaction, data);
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                city = await randomCity();
                data = await weather(city);
                if (typeof data == "string" || data == null || typeof data == "undefined") return await interaction.editReply(displayError(interaction, data) || "An error has occurred");
                await display(interaction, data);
            } catch (e) {
                console.error(e);
            }
        }
    }
});
//On récupere la météo de la ville voulu
const weather = async function (city) {
    try {
        let weatherres = (await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${meteoKey}`)).data;
        return new Data(
            weatherres['name'],
            weatherres['weather'][0]['description'],
            weatherres['sys']['country'],
            weatherres['main']['temp'],
            weatherres['main']['feels_like'],
            weatherres['wind']['speed'],
            weatherres['wind']['deg'],
            weatherres['main']['pressure'],
            weatherres['main']['humidity'],
            weatherres['visibility']
        );
    } catch (e) {
        console.error("Error weather", e, e?.response?.status, e?.response?.data, e.response?.data?.message);
        return e.response?.data?.message;
    }
}
const display = async function (interaction, data) {
    var information = "**" + data.city + ", " + data.country + "**" +
        "\n" + data.celsiusTemp(data.temp) + " °C" +
        "\n     Feels like " + data.celsiusTemp(data.feels_like) + " °C. " + data.description.charAt(0).toUpperCase() + data.description.slice(1);
    try {
        const weatherEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(information)
            .addFields(
                { name: data.wind_speed + "m/s " + data.orientation(data.wind_deg), value: "Humidity: " + data.humidity + "%", inline: true },
                { name: data.pressure + "hPa", value: "Visibility: " + data.visibilityKm(data.visibility) + "km", inline: true },
            );
        await interaction.editReply({ embeds: [weatherEmbed] });
    } catch (e) {
        console.error("Error display", e)
    }
}

const displayError = async function (interaction, data) {
    try {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF001A)
            .setDescription(data)
        await interaction.editReply({ embeds: [errorEmbed] });
    } catch (e) {
        console.error("Error display error", e)
    }

}
function getFormattedDate(today) {
    var week = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    var month = new Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    var day = week[today.getDay()];
    var month = month[today.getMonth()];
    var dd = today.getDate();
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();

    if (dd < 10) { dd = '0' + dd }
    if (min < 10) { min = '0' + min }
    if (sec < 10) { sec = '0' + sec }
    return day + " " + month + " " + dd + " " + yyyy + " " + hour + ":" + min + ":" + sec;
}
function getUser(interaction) {
    return (interaction.user.tag);
}
const writeFile = function (file, information) {
    fs.appendFile(file, information, function (err) {
        if (err) return console.error(err);
    });
}
const writeLog = function (file) {
    var date = new Date();
    var today = getFormattedDate(date);
    var user = getUser(interaction);

    today = "\n[" + today + "]";
    var log = today + user;
    console.log(log);
}
const getCountries = async function () {
    try {
        let request = await axios.get("https://countriesnow.space/api/v0.1/countries");
        return request.data.data;
    } catch (e) {
        console.error("Error country", e);
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
    if ((Date.now() / 1000 / 60) - last >= 0.4) {
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
        console.error(err);
    }
})()

client.login(token);