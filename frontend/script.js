function renderNote(index, element) {
    const data = database.notes[index];

    while (element.firstChild) {
        element.removeChild(element.lastChild);
    }

    const title = document.createElement("h1");
    title.innerText = index;
    title.contentEditable = true;
    title.id = "title";

    const content = document.createElement("p");
    content.innerText = data.content;
    content.contentEditable = true;
    content.id = "content";

    const button = document.createElement("button");
    button.innerText = "Save";

    button.onclick = updateNote;

    element.appendChild(title);
    element.appendChild(content);
    element.appendChild(button);
}

async function updateNote() {
    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    const payload = {
        "title": titleElement.innerText,
        "content": contentElement.innerText,
        "inbound": [],
        "outbound": []
    };

    const response = await fetch("/update", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

async function fetchNotes(indices) {
    const response = await fetch("/fetch", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(indices)
    });

    const content = await response.json();
    return content;
}