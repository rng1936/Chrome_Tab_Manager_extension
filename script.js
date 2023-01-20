let options = document.getElementById("header");
let saveButton = document.getElementById("saveButton");
let saveAllButton = document.getElementById("saveAll");
let loadTabButton = document.getElementById("loadTabs")
let clearTabButton = document.getElementById("clearTabs");
let tabList = document.getElementById("contents");

saveButton.onclick = () => {
    chrome.runtime.sendMessage({message: "Save"});
}

saveButton.onmouseover = () => {
    options.innerHTML = "Save Current Tab";
}

saveButton.onmouseleave = () => {
    options.innerHTML = "Tab Manager";
}

saveAllButton.onclick = () => {
    chrome.runtime.sendMessage({message: "Save all"});
}

saveAllButton.onmouseover = () => {
    options.innerHTML = "Save All Tabs";
}

saveAllButton.onmouseleave = () => {
    options.innerHTML = "Tab Manager";
}

loadTabButton.onclick = () => {
    chrome.runtime.sendMessage({message: "Load"});
}

loadTabButton.onmouseover = () => {
    options.innerHTML = "Load Saved Tabs";
}

loadTabButton.onmouseleave = () => {
    options.innerHTML = "Tab Manager";
}

clearTabButton.onclick = () => {
    chrome.runtime.sendMessage({message: "Clear"});
}

clearTabButton.onmouseover = () => {
    options.innerHTML = "Clear All Saved Tabs";
}

clearTabButton.onmouseleave = () => {
    options.innerHTML = "Tab Manager";
}

window.onload = () => {
    chrome.runtime.sendMessage({message: "Display"})
}

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.message === "empty") tabList.innerHTML = "<h3>Saved Tabs:</h3>";
        else {
            let anchor = document.createElement("a");
            anchor.setAttribute("key", request.key);
            anchor.innerHTML = request.title;
            anchor.href = request.url;
            anchor.addEventListener("click", () => {
                chrome.runtime.sendMessage({message: "Remove Saved Tab", key: anchor.getAttribute("key")});
            })
            tabList.appendChild(anchor);
        }
})