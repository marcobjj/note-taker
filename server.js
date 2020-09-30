const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');




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

    if (req.query) results = filterByQuery(req.query, results);

    res.json(results);

});

app.post('/api/notes', (req, res) => {
    // set id based uniqid module

    req.body.id = uniqid();

    // add note to json file and notes array in this function
    const note = createNewNote(req.body, notes);

    res.json(note);
});

app.get('/', (req, res) => {

    //sends index.html to the root route
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {

    //sends notes.html to the /notes route
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

app.delete('/api/notes/*', (req, res) => {

    console.log(req.url);

    //gets item id from request url
    const id = req.url.split('/api/notes/')[1];
    const note = deleteNote(id, notes);

    return res.json(note);
})

const deleteNote = (id, notesArray) => {

    let note = null;

    //loops notes array to find element id that matches the one sent via request, then deletes it

    notesArray.forEach((element, index) => {
        if (element.id == id) note = notesArray.splice(index, 1);
    })

    return note
}

const filterByQuery = (query, results) => {

    filteredResults = results;

    if (query.id) filteredResults = results.filter(element => element.id == query.id);

    return filteredResults;
}

const createNewNote = (body, notesArray) => {

    const note = body;
    notesArray.push(note);
    
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return note;
}