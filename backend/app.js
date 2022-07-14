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
app.post("/", function(req, res) {
    const payload = req.body;
    const title = payload.title;
    const content = payload.content;
    const inbound = payload.inbound;
    const outbound = payload.outbound;

    if (!(title in database.notes)) {
        database.notes[title] = {};
    }

    database.notes[title].content = content;
    database.notes[title].inbound = inbound;
    database.notes[title].outbound = outbound;
    
    fs.writeFile(
        "database.json", 
        JSON.stringify(database, null, 2), 
        err => {}
    );
});

app.listen(8080);
console.log("http://localhost:8080");