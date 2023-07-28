
let foldInputs = document.getElementsByClassName("foldName");
let folders = document.getElementsByClassName("folders");
let currFolder = 0;

window.onload = () => {
    chrome.runtime.sendMessage({message: "Display", folder: foldInputs[currFolder].value});
    chrome.runtime.sendMessage({message: "Load Folder Names"});
    folders[0].style.backgroundColor = "black";
    currFolder = 0;
    
    eventsSetup();
    for (let i = 0; i < folders.length; ++i) {
        folders[i].addEventListener("click", () => {
            foldInputs[i].focus();
            foldInputs[i].select();

            folders[currFolder].style.backgroundColor = "white";    // unhighlight previous focused folder
            currFolder = i;
            folders[currFolder].style.backgroundColor = "black";
            chrome.runtime.sendMessage({message: "Display", folder: foldInputs[currFolder].value});
        });
    }
}

function eventsSetup() {
    let options = document.getElementById("header");
    let buttons = document.getElementsByClassName("option");

    let renaming = false;
    let prev = [];

    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].onmouseover = () => {
            switch (i) {
                case 0:
                    options.innerHTML = "Save Current Tab";
                    break;
                case 1:
                    options.innerHTML = "Save All Tabs";
                    break;
                case 2:
                    options.innerHTML = "Load Saved Tabs";
                    break;
                case 3:
                    options.innerHTML = "Delete All Saved Tabs";
                    break;
                case 4:
                    options.innerHTML = "Edit/Save Folder Names";
                    break;
            }
        }

        buttons[i].onclick = () => {
            switch (i) {
                case 0:
                    chrome.runtime.sendMessage({message: "Save", folder: foldInputs[currFolder].value});
                    break;
                case 1:
                    chrome.runtime.sendMessage({message: "Save all", folder: foldInputs[currFolder].value});
                    break;
                case 2:
                    chrome.runtime.sendMessage({message: "Load", folder: foldInputs[currFolder].value});
                    break;
                case 3:
                    chrome.runtime.sendMessage({message: "Clear", folder: foldInputs[currFolder].value});
                    break;
                case 4:
                    // Edit/Save Folders
                    renaming = !renaming;
                    let newNames = [];
                    for (let i = 0; i < foldInputs.length; ++i) {
                        // enable and disable editing folder names
                        foldInputs[i].disabled = !foldInputs[i].disabled;
                        if (renaming) {
                            prev.push(foldInputs[i].value);
                        } else {
                            const newFoldName = foldInputs[i].value;
                            const dupeLen = Array.from(foldInputs).filter(val => val.value === newFoldName);
                            
                            // prevent duplicate or empty folder names
                            if (newFoldName.trim().length == 0 || dupeLen.length > 1) foldInputs[i].value = "Folder " + (i * 1 + 1);
                            newNames.push(foldInputs[i].value);
                        }
                    }
                    if (!renaming) {
                        chrome.runtime.sendMessage({message: "Save Folder Name", oldNames: prev, newNames: newNames});
                        prev = []; 
                    }
                    break;
            }
        }

        buttons[i].onmouseleave = () => {
            options.innerHTML = "Tab Manager";
        }
    }

    for (let i = 0; i < folders.length; ++i) {
        folders[i].onmouseover = () => {
            console.log("yes");
            options.innerHTML = foldInputs[i].value;
        }
        folders[i].onmouseleave = () => {
            options.innerHTML = "Tab Manager";
        }
    }
}

let tabList = document.getElementById("contents");
chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.req === "Clean") tabList.innerHTML = "";
        else if (request.req === "Load Folders") {
            let names = request.folderNames;
            for (let i = 0; i < names.length; ++i) {
                foldInputs[i].value = names[i];
            }
        } else {
            // create output display
            let tab = request.tab;
            let anchor = document.createElement("a");
            anchor.innerHTML = tab.title;
            anchor.href = tab.url;
            anchor.addEventListener("click", () => {
                chrome.runtime.sendMessage({message: "Remove Saved Tab", folder: foldInputs[currFolder].value, tabToDel: tab});
            });
            tabList.appendChild(anchor);
        }
})