const express = require("express");
const mustacheExpress = require("mustache-express");
const app = express();

/**
 * Configuration de mustache
 * comme moteur de template
 * pour l'extension .mustache
 */
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

/**
 * Configuration de express
 * pour récupérer les données d'un formulaire
 * et pour servir les fichiers statiques
 * (css, js, images, etc.)
 */
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello <p><a href="/personnages"></a></p>')
})
app.get('/personnages', (req, res) => {
    res.send('Liste des persos')
})
app.get('/personnages/:id', (req, res) => {
    res.send('Liste des persos')
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});