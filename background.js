chrome.runtime.onMessage.addListener(
    async (request) => {
        let action = request.message;
        switch (action) {
            case "Save":
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    saveTab(request.folder, tabs);
                });
                break;
            case "Save all":
                chrome.tabs.query({currentWindow: true}, (tabs) => {
                    saveTab(request.folder, tabs);
                });
                break;
            case "Load":
                let folder = request.folder;
                chrome.storage.sync.get(folder).then((result) => {
                    let first = true;
                    const tabs = result[folder];
                    for (let tab of tabs) {
                        if (first) {
                            chrome.windows.create({url: tab.url, state: "maximized"});
                            first = false;
                        } else chrome.tabs.create({url: tab.url});
                    }
                });
                break;
            case "Clear":
                clearFolder(request.folder);
                display(request.folder);
                break;
            case "Display":
                display(request.folder);
                break;
            case "Remove Saved Tab":
                chrome.storage.sync.get(request.folder).then((result) => {
                    let folderTabs = result[request.folder];
                    folderTabs = folderTabs.filter(tabs => tabs.url !== request.tabToDel.url);
                    chrome.storage.sync.set({[request.folder]: folderTabs}).then(() => {
                        display(request.folder);
                    });
                });
                break;
            case "Load Folder Names":
                // folder names are stored in chrome.storage.sync in an array
                chrome.storage.sync.get("uS3rK3y5./cq17").then((result) => {
                    if (result.hasOwnProperty("uS3rK3y5./cq17")) {  // checks if designated space exists
                        chrome.runtime.sendMessage({req: "Load Folders", folderNames: result["uS3rK3y5./cq17"]});
                    } else {
                        let folderNames = ["Folder 1", "Folder 2", "Folder 3", "Folder 4", "Folder 5", "Folder 6"];
                        chrome.storage.sync.set({"uS3rK3y5./cq17": folderNames});
                    }
                });
                break;
            case "Save Folder Name":
                let oldKeys = request.oldNames;
                let newKeys = request.newNames;
                
                // update array of folder names
                chrome.storage.sync.remove("uS3rK3y5./cq17", () => {
                    chrome.storage.sync.set({"uS3rK3y5./cq17": newKeys});
                });
                // update chrome.storage.sync keys
                for (let i = 0; i < oldKeys.length; ++i) {
                    let oldKey = oldKeys[i];
                    chrome.storage.sync.get(oldKey).then((result) => {
                        let val = result[oldKey];
                        chrome.storage.sync.remove(oldKey, () => {
                            let newKey = newKeys[i];
                            chrome.storage.sync.set({[newKey]: val});
                        });
                    });
                }
                break;
        }
})

function saveTab(folder, tabs) { 
    tabs = [...new Map(tabs.map((t) => [t.url, t])).values()];
    chrome.storage.sync.get(folder).then((result) => {
        let tabsinFolder = result[folder] || [];
        for (let tab of tabsinFolder) {
            // check for duplicates in previous saved tabs
            const duplicate = tabs.find(allTab => allTab.url === tab.url);
            if (duplicate === undefined) {
                tabs.push(tab);
            }
        }
        chrome.storage.sync.set({[folder]: tabs}).then(() => {
            display(folder);
        });
    });
}

function clearFolder(folder) {
    chrome.storage.sync.remove(folder);
}

function display(folder) { 
    chrome.storage.sync.get(folder).then((result) => {
        let savedTabs = result[folder] || [];
        chrome.runtime.sendMessage({req: "Clean"});
        for (let tab of savedTabs) {
            chrome.runtime.sendMessage({req: "Create Tab", tab: tab});
        }
    });
}