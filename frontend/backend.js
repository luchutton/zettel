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