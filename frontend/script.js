const searchBox = document.querySelector("#searchbox");

const state = {
    "notes": {},
    "current": null
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

function updateCurrent() {
    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    state.current.title = titleElement.innerText;
    state.current.content = contentElement.innerText;
}

async function save() {
    if (state.current) {
        updateCurrent();
        state.current.save();
    } else {
        // TODO: Make create note function to do this less bad
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
}

async function search() {
    const inputElement = document.querySelector("#searchbox");
    const term = inputElement.value;

    const response = await request("/search", {"term": term});
    const indices = await response.json();

    await fetchNotes(indices);

    const resultBox = document.querySelector("#results");
    clearElement(resultBox);
    
    for (let index of indices) {
        const container = document.createElement("DIV");
        container.classList.add("linkbox");

        const note = state.notes[index];
        
        const button = document.createElement("p");
        button.innerText = note.title;

        button.onclick = function() {
            selectResult(index);
        };

        const link = document.createElement("p");
        link.innerText = "🔗";

        link.onclick = function() {
            state.current.linker(index);
            state.current.render();
        }

        container.appendChild(button);
        container.appendChild(link);
        resultBox.appendChild(container);
    }
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

    state.current.render();
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

searchBox.oninput = search;