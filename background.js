
chrome.runtime.onMessage.addListener(
    async (request) => {
        let action = request.message;
        switch (action) {
            case "Save":
                await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    saveTab(tabs[0]);
                });
                break;
            case "Save all":
                await chrome.tabs.query({currentWindow: true}, (tabs) => {
                    for (let tab of tabs) {
                        saveTab(tab);
                    }
                });
                break;
            case "Load":
                chrome.storage.sync.get(null, (objOfKeys) => {
                    for (var val in objOfKeys) {
                        let curTab = objOfKeys[val];
                        chrome.tabs.create({'url': curTab.url});
                    }
                });
                break;
            case "Clear":
                clearStorage();
                break;
            case "Display":
                display();
                break;
            case "Remove Saved Tab":
                chrome.storage.sync.remove([request.key], () => {
                    chrome.runtime.sendMessage({message: "empty"});
                    display();
                });
                break;
        }
})

function saveTab(tab) {
    let key = tab.url;
    chrome.storage.sync.get([key], (result) => {
        if (Object.keys(result).length === 0) {
            chrome.storage.sync.set({[key] : tab}, () => {
                chrome.runtime.sendMessage({title : tab.title, url : tab.url});
            });
        }
    });
}

function clearStorage() {
    chrome.storage.sync.clear(() => {
        chrome.runtime.sendMessage({message: "empty"});
    });
}

function display() { 
    chrome.storage.sync.get(null, (objOfKeys) => {
        for (var val in objOfKeys) {
            let curTab = objOfKeys[val];
            chrome.runtime.sendMessage({title : curTab.title, url : curTab.url});
        }
    });
}