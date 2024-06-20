const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Page d'accueil avec le formulaire
app.get('/', (req, res) => {
  res.send(`
    <form action="/mon-formulaire" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name">
      <button type="submit">Submit</button>
    </form>
  `)
})

// Route pour gérer le POST du formulaire
app.post('/mon-formulaire', (req, res) => {
  const name = req.body.name;
  res.send('Vous avez soumis le nom : '+name);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})