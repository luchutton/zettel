const express = require("express");
const app = express();

const fs = require("fs");

const database = JSON.parse(fs.readFileSync("database.json"));

app.set("view engine", "ejs");

app.use(express.static("../frontend"));

app.get("/", function(req, res) {
    res.render("index", {
        "data": JSON.stringify(database)
    });
});

app.use(express.json());
app.post("/update", function(req, res) {
    const payload = req.body;
    const title = payload.title;
    const content = payload.content;
    const links = payload.links;

    if (!(title in database.notes)) {
        database.notes[title] = {};
    }

    database.notes[title].content = content;
    database.notes[title].links = links;
    
    fs.writeFile(
        "database.json", 
        JSON.stringify(database, null, 2), 
        err => {}
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
        if (index.includes(term) || term.includes(index)) {
            results.push(index);
        }
    }

    res.end(JSON.stringify(results));
});

app.listen(8080);
console.log("http://localhost:8080");