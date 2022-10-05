# Boreas

A discord bot that gives you the weather in the chosen city

 ## Set up
 - Download the project
 - Go to the ```src``` folder
 - Create the ```config.json``` file

## Create your bot

- Go to the following link https://discord.com/developers/applications
- Create a new app
- Remember to invite your bot to the desired server

## config.json


- Open the file you just created and compose the following code
```json
 {
    "clientId": "",
    "token": "",
    "meteoKey": ""
}
```
- Get your clientId 
![image](https://user-images.githubusercontent.com/83158666/194072353-ba2595eb-c23a-482a-b7ca-eb89b428a9e9.png)
- Add it to
```json
"clientId": ""
```
- Get your token 
![image](https://user-images.githubusercontent.com/83158666/194072826-2ae0b310-9af9-438b-bc7e-f99f0730f79a.png)
- Add it to
```json
"token": ""
```
- Create an account on https://openweathermap.org
- Get your API key
- Add to
```json
"meteoKey": ""
```

## Launch the bot

- ```node index.js``` in command prompt

## Fonctionnalité 

```/weather city``` to get the weather forecast for the chosen city  
```/weather``` to get the weather forecast for a random city
