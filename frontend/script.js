const searchBox = document.querySelector("#searchbox");
const noteElement = document.querySelector("#note");

const state = {
    "notes": {},
    "current": null,
    "searchResults": []
};

async function request(path, json) {
    const response = await fetch(path, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    });

    return response;
}

async function fetchNotes(indices) {
    const response = await request("/fetch", indices);
    const content = await response.json();

    for (let index in content) {
        state.notes[index] = new Note(index, content[index]);
    }

    return content;
}

// function updateCurrent() {
//     const titleElement = document.querySelector("#title");
//     const contentElement = document.querySelector("#content");

//     state.current.title = titleElement.innerText;
//     state.current.content = contentElement.innerText;
    
//     for (let dependent of state.current.dependents) {
//         dependent.update();
//     }
// }

async function save() {
    if (!state.current) {
        await initialiseNote();
    }

    //updateCurrent();
    state.current.save();
}

async function search() {
    const inputElement = document.querySelector("#searchbox");
    const term = inputElement.value;

    const response = await request("/search", {"term": term});
    const indices = await response.json();

    await fetchNotes(indices);
    state.searchResults = [];

    const resultBox = document.querySelector("#results");
    clearElement(resultBox);
    
    for (let index of indices) {
        const searchResult = new SearchResult(index, document.createElement("DIV"));
        const rendered = searchResult.render();

        resultBox.appendChild(rendered);
        state.searchResults.push(searchResult);
    }
}

function noteTemplate() {
    const container = document.querySelector("#note");
    clearElement(container);

    container.insertAdjacentHTML(
        "afterbegin",
        `<div id="top">
        <h1 id="title" contenteditable="true" placeholder="Title"></h1>
        <button onclick="save()">💾</button>
    </div>
    
    <p id="content" contenteditable="true" placeholder="Content"></p>
    <div id="links"></div>`
        );
}

async function createNote() {
    state.current = null;
    noteTemplate();
}

async function initialiseNote() {
    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    const title = titleElement.innerText;
    const content = contentElement.innerText;

    const payload = {
        "title": title,
        "content": content,
        "links": {}
    };

    const response = await request("/update", payload);
    const json = await response.json();

    const note = new Note(json.id, payload);

    state.notes[json.id] = note;
    state.current = note;
}

async function selectResult(index) {
    if (!(index in state.notes)) {
        await fetchNotes([index]);
    }
    
    state.current = state.notes[index];

    const load = [];
    for (let index in state.current.links) {
        if (index in state.notes) continue;

        load.push(index);
    }

    await fetchNotes(load);

    noteTemplate();
    state.current.render();
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

searchBox.oninput = search;
noteElement.oninput = function() {
    state.current.update();
}
