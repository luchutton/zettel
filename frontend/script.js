const searchBox = document.querySelector("#searchbox");
const noteElement = document.querySelector("#note");

const state = {
    "notes": {},
    "current": null,
    "searchResults": []
};

async function save() {
    if (!state.current) {
        await initialiseNote();
    }

    state.current.save();
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
    initialiseNote();
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
