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

    button.onclick = updateNode;

    element.appendChild(title);
    element.appendChild(content);
    element.appendChild(button);
}

function updateNode() {
    const titleElement = document.querySelector("#title");
    const contentElement = document.querySelector("#content");

    const payload = {
        "title": titleElement.innerText,
        "content": contentElement.innerText,
        "inbound": [],
        "outbound": []
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/", "true");

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(payload));
}

renderNote("llamas", document.getElementById("note"));