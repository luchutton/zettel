class SearchResult {
    constructor(index, container, parent) {
        this.index = index;
        this.container = container;
        this.parent = parent;

        if (!state.notes[index]) fetchNotes([index]);

        this.note = state.notes[index];
        this.note.dependents.push(this);

        this.children = [];
        this.expanded = false;
    }

    expand() {
        if (!this.children.length) {
            for (let link in this.note.links) {
                const child = new SearchResult(link, document.createElement("DIV"), this);
                this.children.push(child);
            }
        }

        this.expanded = true;
        this.render();
    }

    collapse() {
        this.expanded = false;
        this.render();
    }

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

        clearElement(this.container);
        
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
        if (this.expanded) {
            expand.innerText = "-";
    
            expand.onclick = function() {
                this.collapse();
            }.bind(this);
        } else {
            expand.innerText = "+";
    
            expand.onclick = function() {
                this.expand();
            }.bind(this);
        }
        
        container.appendChild(expand);
        container.appendChild(button);
        container.appendChild(link);

        this.title = button;
        
        this.container.appendChild(container);

        if (this.expanded) {
            const childContainer = document.createElement("DIV");
            childContainer.classList.add("child");
            for (let child of this.children) {
                const rendered = child.render();
                childContainer.appendChild(rendered);
            }

            this.container.appendChild(childContainer);
        }

        return this.container;
    }
}