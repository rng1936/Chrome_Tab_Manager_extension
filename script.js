let options = document.getElementById("header");
let saveButton = document.getElementById("saveButton");
let saveAllButton = document.getElementById("saveAll");
let loadTabButton = document.getElementById("loadTabs")
let clearTabButton = document.getElementById("clearTabs");
let editFolder = document.getElementById("editFolders");
let tabList = document.getElementById("contents");

let renaming = false;
let folders = document.getElementsByClassName("folders");

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
    options.innerHTML = "Delete All Saved Tabs";
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
            anchor.setAttribute("key", request.url);
            anchor.innerHTML = request.title;
            anchor.href = request.url;
            anchor.addEventListener("click", () => {
                chrome.runtime.sendMessage({message: "Remove Saved Tab", key: anchor.getAttribute("key")});
            })
            tabList.appendChild(anchor);
        }
})

editFolder.onmouseover = () => {
    options.innerHTML = "Edit/Save Folder Names (WIP)"; // WIP
}

editFolder.onmouseleave = () => {
    options.innerHTML = "Tab Manager";
}

editFolder.onclick = () => {
    renaming = !renaming;
    for (var i = 0; i < folders.length; ++i) {
        folders[i].disabled = !folders[i].disabled;
    }
    if (!renaming) {
        for (var i = 0; i < folders.length; ++i) {
            console.log(folders[i].value);
            chrome.runtime.sendMessage({message: "Save Folder Name", name: folders[i].value});
        } 
    }
}