const express = require("express");
const mustacheExpress = require("mustache-express");
const db = require("./database");
const multer = require("multer");
const path = require("path");
const app = express();

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/personnages'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier
    }
});

const upload = multer({ storage: storage });

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(__dirname + '/images'));

// Route pour afficher le formulaire d'ajout de personnage
app.get('/ajouterPersonnage', (req, res) => {
    res.render('ajouterPersonnage');
});

// Route pour gérer l'ajout de personnage
app.post('/ajouterPersonnage', upload.single('avatar'), (req, res) => {
    const nom = req.body.nom;
    const description = req.body.description;
    const avatar = req.file.filename;

    // Insertion dans la base de données
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

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
