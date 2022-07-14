const searchBox = document.querySelector("#searchbox");

const database = {
    "notes": {}
};

let currentNote = null;

function renderNote(index, element) {
    const data = database.notes[index];

    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    titleElement.innerText = index;
    contentElement.innerText = data.content;

    const linksElement = document.querySelector("#links");

    clearElement(linksElement);
    
    for (let link of data.links) {
        const button = document.createElement("BUTTON");
        button.innerText = link;
        button.onclick = function() {
            selectResult(link);
        }

        linksElement.appendChild(button);
    }
}

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

async function updateNote() {
    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    const payload = {
        "title": titleElement.innerText,
        "content": contentElement.innerText,
        "links": []
    };

    await request("/update", payload);
}

async function fetchNotes(indices) {
    const response = await request("/fetch", indices);
    const content = await response.json();

    for (let index in content) {
        database.notes[index] = content[index];
    }

    return content;
}

async function search() {
    const inputElement = document.querySelector("#searchbox");
    const term = inputElement.value;

    const response = await request("/search", {"term": term});
    const indices = await response.json();

    const resultBox = document.querySelector("#results");
    clearElement(resultBox);
    
    for (let index of indices) {
        const button = document.createElement("BUTTON");
        button.innerText = index;

        button.onclick = function() {
            selectResult(index);
        };

        resultBox.appendChild(button);
    }
}

async function selectResult(index) {
    if (!(index in database)) {
        await fetchNotes([index]);
    }

    currentNote = index;

    renderNote(index, document.querySelector("#note"));
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

searchBox.oninput = search;