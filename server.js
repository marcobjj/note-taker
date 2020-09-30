const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const notes = require('./db/db.json');


app.get('/api/notes', (req, res) => {
    let results = notes;

    if(req.query) results = filterByQuery(req.query, results);

    res.json(results);
 
  });

console.log(notes.join());


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

const filterByQuery = (query,results) => {
    filteredResults = results;

    if (query.id) filteredResults = results.filter(element => element.id == query.id);

    return filteredResults;
}