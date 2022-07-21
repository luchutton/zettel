const express = require("express");
const app = express();

const fs = require("fs");

const database = JSON.parse(fs.readFileSync("database.json"));

app.use(express.static("../frontend"));

function errorHandler(error) {
    //console.error(error);
}

app.use(express.json());
app.post("/update", function(req, res) {
    const payload = req.body;
    const id = payload.id;
    const title = payload.title;
    const content = payload.content;
    const links = payload.links;

    if ("id" in payload) {
        database.notes[id] = {
            "title": title,
            "content": content,
            "links" : links
        };
    } else {
        const next = database.index++;
        
        database.notes[next] = {
            "title": title,
            "content": content,
            "links" : links
        };
    
        res.end(JSON.stringify({"id": next}));
    }

    fs.writeFile(
        "database.json", 
        JSON.stringify(database, null, 2), 
        errorHandler
    );
});

app.post("/fetch", function(req, res) {
    const indices = req.body;
    const notes = {};
    
    for (let index of indices) {
        const note = database.notes[index];
        notes[index] = note;
    }

    res.end(JSON.stringify(notes));
});

app.post("/search", function(req, res) {
    const term = req.body.term;

    const results = [];

    for (let index in database.notes) {
        const note = database.notes[index];
        if (note.title.includes(term) || term.includes(note.title)) {
            results.push(index);
        }
    }

    res.end(JSON.stringify(results));
});

app.listen(8080);
console.log("http://localhost:8080");