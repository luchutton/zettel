const main = document.querySelector(".side");
const title = document.querySelector("#title");
const content = document.querySelector("#content");

let side = 0;

main.onclick = function() {
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