# Boreas
 Un bot discord qui donne la météo
 
 ## Installation 
 - Télécharger le projet 
 - Aller dans le dossier ```src```
 - Créer le fichier ```config.json```

## Créer votre bot 

- Allez sur le lien suivant [Discord developers] https://discord.com/developers/applications
- Créer une nouvelle application (new application) 
- Pensez à inviter votre bot sur le serveur voulu

## config.json

- Ouvrez le fichier que vous venez de créer 
- Récuperer le clientId 
![image](https://user-images.githubusercontent.com/83158666/194072353-ba2595eb-c23a-482a-b7ca-eb89b428a9e9.png)
- Ajoutez le à configId
- Récuperer votre token 
![image](https://user-images.githubusercontent.com/83158666/194072826-2ae0b310-9af9-438b-bc7e-f99f0730f79a.png)
- Ajoutez le à token

 ```json
 {
    "clientId": "",
    "token": "",
    "meteoKey": ""
}
```

## Lancer le bot

- ```node index.js``` dans l'invité de commande
