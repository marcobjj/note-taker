const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');


const PORT = process.env.PORT || 3001;

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// fetch the static html pages
app.use(express.static('public'));


const notes = require('./db/db.json');


app.get('/api/notes', (req, res) => {
    let results = notes;

    console.log(notes)

    if(req.query) results = filterByQuery(req.query, results);

    res.json(results);
 
  });

app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be

    req.body.id = notes.notes.length;
  
    // add note to json file and notes array in this function
    const note = createNewNote(req.body, notes.notes);
  
    res.json(note);
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });

  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });


  app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });


const filterByQuery = (query,results) => {
    filteredResults = results;

    if (query.id) filteredResults = results.filter(element => element.id == query.id);

    return filteredResults;
}

const createNewNote = (body, notesArray) => {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
    return note;
  }