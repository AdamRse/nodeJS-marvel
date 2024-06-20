const express = require("express");
const mustacheExpress = require("mustache-express");
const db = require("./database");
const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(__dirname + '/images'));

app.get('/', (req, res) => {
    res.send('Hello <p><a href="/personnages">Liste des personnages</a></p>');
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
