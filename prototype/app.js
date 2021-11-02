// *** Import d'express ***

const express = require('express');
const app = express();


// *** Configuration d'express ***

// Port du serveur :
const SERVER_PORT = 8000;

/* Autorisation de l'accès au dossier 'js' pour des fichiers statiques.
Tout chemin n'ayant pas été défini dans ce fichier n'est pas accesible par l'application
*/

// Permettre l'encocade des données JSON incluses dans l'url d'une requête :
app.use(express.urlencoded({extended:true}));

//
app.use(express.static('public'));


// *** Gestion des requêtes GET ***

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/index.html');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname+'/admin.html');
});


// *** Route par defaut, si aucune ci-dessus ne correspond : 404 ***

app.use((req, res) => {
    res.status(404).sendFile(__dirname+'/404.html');
});


// *** Démarrage du serveur ***

app.listen(SERVER_PORT, () => {
    console.log('Serveur démarré sur le port ' + SERVER_PORT);
})
