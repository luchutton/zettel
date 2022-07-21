const card = document.querySelector("#card");
const title = document.querySelector("#title");
const content = document.querySelector("#content");

let side = 0;

card.onclick = function() {
    if (side === 0) {
        title.classList.add("hidden");
        content.classList.remove("hidden");
        side = 1;
    } else {
        title.classList.remove("hidden");
        content.classList.add("hidden");
        side = 0;
    }
}