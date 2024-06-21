const express = require("express"); // Simplifie  les appels serveur
const mustacheExpress = require("mustache-express");// Externaliser le html (twig)
const multer = require("multer");// Gère l'upload et le stockage de fichiers uploadés
const path = require("path");// Fournit un accès aux dossiers et fichiers du serveur

//Appels modules et fichiers
const db = require("./database");
const app = express();

// Configurer le stockage des fichiers vial le module multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/personnages'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier
    }
});
const upload = multer({ storage: storage });

//app config
//engine() : utilise un moteur supplémentaire avec express
app.engine("mustache", mustacheExpress());// Ajouter Mustache à express
//set() : paramètre les valeurs des settings de express (comme ini_set() de php)
app.set("view engine", "mustache");// change la valeur de l'option view engine pour mustache (ajouter mustache à express dans les settings)
app.set("views", __dirname + "/views");// Set le dossier views de mustache
//use() : monte un middleware
app.use(express.static("public"));// autoriser l'appel de fichiers dans le répertoire "/public" (./css/global.css par exemple) (par défaut l'accès est interdit à tous les fichiers)
app.use(express.urlencoded({ extended: true }));// permet d'utiliser des données POST plus complètes (ex : person[age]=34&person[weight]=100)

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Routes
//req : informations sur la requpête (req.query, req.params, req.body, req.headers, req.method, req.url, req.cookies)
//res : methodes pour envoyer des réponses au client (une seule possible) (res.send(), res.json(), res.render(), res.redirect(), res.statut(), res.set(), res.cookie())
app.get('/ajouterPersonnage', (req, res) => {
    res.render('ajouterPersonnage');
});
app.post('/ajouterPersonnage', upload.single('avatar'), (req, res) => {
    const nom = req.body.nom;
    const description = req.body.description;
    const avatar = req.file.filename;

    db.query('INSERT INTO personnages (nom, description, photo) VALUES (?, ?, ?)', [nom, description, avatar], (error, results) => {
        if (error) throw error;
        res.redirect('/personnages');
    });
});
app.get('/', (req, res) => {
    res.send('Hello <p><a href="/personnages">Liste des personnages</a></p><p><a href="/ajouterPersonnage">Ajouter un personnages</a>');
});
app.get('/personnages', (req, res) => {
    db.query('SELECT * FROM personnages', (error, results) => {
        if (error) throw error;
        res.render('personnages', { personnages: results });
    });
});
app.get('/personnages/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM personnages WHERE id = ?', [id], (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.render('personnage', { personnage: results[0] });
        } else {
            res.status(404).send('Personnage non trouvé');
        }
    });
});
