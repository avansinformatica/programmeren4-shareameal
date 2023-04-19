const express = require('express');
const app = express();
const port = 3000;

app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

app.get('/api/info', (req, res) => {
  // let path = req.path;
  // console.log(`op route ${pad}`);
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'Davide',
      studentNumber: 1234567,
      description: 'Welkom bij de server API van de share a meal.',
    },
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {},
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
