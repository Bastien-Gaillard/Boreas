//Dependance et import 
const { Client, GatewayIntentBits, GuildChannel, REST, Routes } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require("fs"); 
const { channels } = require('discord.js');
const { info, dir } = require('console');
const config = JSON.parse(fs.readFileSync("./config.json"));
const token = config.token;
const guildId = config.guildId;
const clientId = config.clientId;
const meteoKey = config.meteoKey;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST(({ version: 10})).setToken(token);
//Object pour récolter toutes les infos de la ville
let Data = class {
    constructor(city, description,country,temp, feels_like, wind_speed, wind_deg, pressure, humidity, visibility) {
        this.city = city;
        this.description = description;
        this.country = country;
        this.temp = temp;
        this.feels_like = feels_like;
        this.wind_speed = wind_speed;
        this.wind_deg = wind_deg;
        this.pressure = pressure;
        this.humidity = humidity;
        this.visibility = visibility;
    }
    //Getter et setteur
    get city(){ 
        return this._city;
    }
    set city(value){ 
        this._city  = value;
    }
    get description(){ 
        return this._description;
    }
    set description(value){ 
        this._description  = value;
    }
    get country(){ 
        return this._country;
    }
    set country(value){ 
        this._country  = value;
    }
    get temp(){ 
        return this._temp;
    }
    set temp(value){ 
        this._temp  = value;
    }
    get feels_like(){ 
        return this._feels_like;
    }
    set feels_like(value){ 
        this._feels_like  = value;
    }
    get wind_speed(){ 
        return this._wind_speed;
    }
    set wind_speed(value){ 
        this._wind_speed  = value;
    }
    get wind_deg(){ 
        return this._wind_deg;
    }
    set wind_deg(value){ 
        this._wind_deg  = value;
    }
    get pressure(){ 
        return this._pressure;
    }
    set pressure(value){ 
        this._pressure  = value;
    }
    get humidity(){ 
        return this._humidity;
    }
    set humidity(value){ 
        this._humidity  = value;
    }
    get visibility(){ 
        return this._visibility;
    }
    set visibility(value){ 
        this._visibility  = value;
    }
    //Method 
    //Convertie la temperature (Kelvin -> Celsius)
    celsiusTemp(temp){  
        return Math.round(temp - 273.15);
    }
    //Donne la direction du vent en fonction du degrée du vent
    orientation(deg){  
        let direction = "";
        if(deg >= 337.5 || (deg >= 0 && deg < 22.5)){
            direction = "N";
        } else if(deg >= 22.5 && deg < 67.5){
            direction = "NE";
        } else if(deg >= 67.5 && deg < 112.5){
            direction = "E";
        } else if(deg >= 112.5 && deg < 157.5){
            direction = "SE";;
        } else if(deg >= 157.5 && deg < 202.5){
            direction = "S";
        } else if(deg >= 202.5 && deg < 247.5){
            direction = "SW";
        } else if(deg >= 247.5 && deg < 292.5) {
            direction = "W";
        } else if(deg >= 292.5 && deg < 337.5) {
            direction = "NW";
        }
        return direction;
    }
    //Convertie la visibilité (m -> km)
    visibilityKm(visibility){
        return visibility / 1000;
    }
};

//Interaction client 
client.on( 'interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    var city;
    var data;
    //Si la commande tapé est 'weather' on appele la fonction weather() et on l'affiche dans un embed
    if (interaction.commandName === 'weather') {
        city = interaction.options.getString('city');
        if(city != null){
            data =  await weather(city);
            display(interaction, data);
        } else {
            city = randomCity();
            data =  await weather(city);
            display(interaction, data);
        }
        
    }
  });
  

client.login(token);

//On récupere la météo de la ville voulu
const weather = async function (city) { 
    try {
        return await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${meteoKey} `)
        .then((reponse) => {
            //On créer et retourne l'objet Data avec les valeurs récuperer de la requete
            return new Data(
                reponse['data']['name'],
                reponse['data']['weather'][0]['description'],
                reponse['data']['sys']['country'],
                reponse['data']['main']['temp'],
                reponse['data']['main']['feels_like'],
                reponse['data']['wind']['speed'],
                reponse['data']['wind']['deg'],
                reponse['data']['main']['pressure'],
                reponse['data']['main']['humidity'],
                reponse['data']['visibility']
                );
        }).catch((e) => {
            console.log("searchChannels ERROR:", e);
        });
    } catch(e){
        console.log("Erreur " + e);
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
    interaction.client.channels.cache.get("873878362806972436").send({ embeds: [exampleEmbed] });
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

async function main() {
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
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      client.login(token);
    } catch (err) {
      console.log(err);
    }
  }
  main();