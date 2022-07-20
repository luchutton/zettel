class SearchResult {
    constructor(index, parent) {
        this.index = index;
        this.parent = parent;

        this.note = state.notes[index];
        this.note.dependents.push(this);

        this.children = [];
    }

    expand() {}

    update() {
        this.title.innerText = this.note.title;
        if (!this.note.title) {
            this.title.innerText = "not named";
            this.title.classList.add("unnamed");
        } else {
            this.title.classList.remove("unnamed");
        }
    }

    render() {
        const container = document.createElement("DIV");
        container.classList.add("linkbox");
        
        const button = document.createElement("p");
        button.innerText = this.note.title;

        if (!this.note.title) {
            button.innerText = "not named";
            button.classList.add("unnamed");
        } else {
            button.classList.remove("unnamed");
        }
        
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

        this.title = button;
        
        return container;
    }
}