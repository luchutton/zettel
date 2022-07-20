class Note {
    constructor(id, data) {
        this.id = id;
        this.title = data.title;
        this.content = data.content;

        this.links = data.links;

        this.dependents = [];
    }

    update() {
        const titleElement = document.querySelector("#title");
        const contentElement = document.querySelector("#content");

        this.title = titleElement.innerText;
        this.content = contentElement.innerText;
        
        for (let dependent of this.dependents) {
            dependent.update();
        }
    }

    linker(index) {
        if (index === this.id) return;

        if (index in this.links) {
            delete this.links[index];
        } else {
            this.links[index] = true;
        }
    }

    save() {
        const payload = {
            "id": this.id,
            "title": this.title,
            "content": this.content,
            "links": this.links
        };

        request("/update", payload);
    }

    render() {
        const titleElement = document.querySelector("#title");
        const contentElement = document.querySelector("#content");
    
        titleElement.innerText = this.title;
        contentElement.innerText = this.content;
    
        const linksElement = document.querySelector("#links");
    
        clearElement(linksElement);
        
        for (let link in this.links) {
            const linked = state.notes[link];

            const container = document.createElement("DIV");
            container.classList.add("linkbox");
            
            const button = document.createElement("p");
            button.innerText = linked.title;
    
            button.onclick = function() {
                selectResult(link);
            };
    
            const deleter = document.createElement("p");
            deleter.innerText = "×";
    
            deleter.onclick = function() {
                this.linker(link);
                this.render();
            }.bind(this);
    
            container.appendChild(button);
            container.appendChild(deleter);
            linksElement.append(container);
        }
    }
}