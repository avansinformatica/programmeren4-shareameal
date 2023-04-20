const express = require('express');

const app = express();
const port = 3000;

// For access to application/json request body
app.use(express.json());

// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
let database = {
  users: [
    {
      id: 0,
      firstname: 'Hendrik',
      lastname: 'van Dam',
      email: 'hvd@server.nl'
    },
    {
      id: 1,
      firstname: 'Marieke',
      lastname: 'Jansen',
      email: 'm@server.nl'
    }
  ]
};

// Ieder nieuw item in db krijgt 'autoincrement' index.
// Je moet die wel zelf toevoegen!
let index = database.users.length;

// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get('/api/info', (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Davide',
      studentNumber: 1234567,
      description: 'Welkom bij de server API van de share a meal.'
    }
  });
});

// UC-201 Registreren als nieuwe user
app.post('/api/register', (req, res) => {
  // De usergegevens zijn meegestuurd in de request body.
  // In de komende lessen gaan we testen of dat werkelijk zo is.
  const user = req.body;
  console.log('user = ', user);

  // Zorg dat de id van de nieuwe user toegevoegd wordt
  // en hoog deze op voor de volgende insert.
  user.id = index++;
  // User toevoegen aan database
  database['users'].push(user);

  res.status(200).json({
    status: 200,
    message: 'User info-endpoint',
    data: user
  });
});

// UC-202 Opvragen van overzicht van users
app.get('/api/user', (req, res) => {
  // er moet precies 1 response verstuurd worden.
  res.status(200).json({
    status: 200,
    message: 'User info-endpoint',
    data: database.users
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
