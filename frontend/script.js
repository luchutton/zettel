const searchBox = document.querySelector("#searchbox");

const state = {
    "notes": {},
    "current": {}
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

async function search() {
    const inputElement = document.querySelector("#searchbox");
    const term = inputElement.value;

    const response = await request("/search", {"term": term});
    const indices = await response.json();

    const resultBox = document.querySelector("#results");
    clearElement(resultBox);
    
    for (let index of indices) {
        const container = document.createElement("DIV");
        container.classList.add("linkbox");
        
        const button = document.createElement("p");
        button.innerText = index;

        button.onclick = function() {
            selectResult(index);
        };

        const link = document.createElement("p");
        link.innerText = "🔗";

        link.onclick = function() {
            linkNote(index);
        }

        container.appendChild(button);
        container.appendChild(link);
        resultBox.appendChild(container);
    }
}

function linkNote(index) {
    state.current.link(index);
    state.current.render(document.querySelector("#note"));
}

async function selectResult(index) {
    if (!(index in state)) {
        await fetchNotes([index]);
    }

    state.current = state.notes[index];
    state.current.render(document.querySelector("#note"));
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }
}

searchBox.oninput = search;