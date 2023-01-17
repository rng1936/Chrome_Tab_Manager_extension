document.getElementById("saveButton").addEventListener("click", () => {
    console.log("Save clicked");
    chrome.runtime.sendMessage({message: "Save"});
});

document.getElementById("saveAll").addEventListener("click", () => {
    chrome.runtime.sendMessage({message: "Save all"});
});

document.getElementById("viewTabs").addEventListener("click", () => {
    console.log("View clicked");
    chrome.runtime.sendMessage({message: "View"});
});

document.getElementById("loadTabs").addEventListener("click", () => {
    chrome.runtime.sendMessage({message: "Load"});
});

document.getElementById("clearTabs").addEventListener("click", () => {
    chrome.runtime.sendMessage({message: "Clear"});
});