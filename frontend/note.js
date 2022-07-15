class Note {
    constructor(title, data) {
        this.title = title;
        this.content = data.content;

        this.links = data.links;
    }

    link(index) {
        this.links[index] = true;
    }

    save() {
        const payload = {
            "title": this.title,
            "content": this.content,
            "links": this.links
        };

        request("/update", payload);
    }

    render(container) {
        const titleElement = document.querySelector("#title");
        const contentElement = document.querySelector("#content");
    
        titleElement.innerText = this.title;
        contentElement.innerText = this.content;
    
        const linksElement = document.querySelector("#links");
    
        clearElement(linksElement);
        
        for (let link in this.links) {
            const button = document.createElement("BUTTON");
            button.innerText = link;
            button.onclick = function() {
                selectResult(link);
            }
    
            linksElement.appendChild(button);
        }
    }
}