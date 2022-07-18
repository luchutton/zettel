class SearchResult {
    constructor(index, parent) {
        this.index = index;
        this.parent = parent;

        this.note = state.notes[index];

        this.children = [];
    }

    expand() {}

    render() {
        const container = document.createElement("DIV");
        container.classList.add("linkbox");
        
        const button = document.createElement("p");
        button.innerText = this.note.title;
        
        button.onclick = function() {
            selectResult(this.index);
        }.bind(this);
    
        const link = document.createElement("p");
        link.innerText = "🔗";
    
        link.onclick = function() {
            state.current.linker(this.index);
            state.current.render();
        }.bind(this);
    
        const expand = document.createElement("p");
        expand.innerText = "+";
    
        expand.onclick = function() {
            this.expand();
        }.bind(this);
    
        container.appendChild(button);
        container.appendChild(link);
        
        return container;
    }
}