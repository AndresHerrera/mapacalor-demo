const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/csv', (req, res) => {
  const filePath = 'data/actiontracker.tramas.csv';
  
  const fileStream = fs.createReadStream(filePath);
  const data = [];
  
  fileStream
    .pipe(csv())
    .on('data', (row) => {
      data.push(row);
    })
    .on('end', () => {
      res.json(data);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Error al procesar el archivo CSV');
    });
	
	
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});