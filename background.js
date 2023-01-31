
chrome.runtime.onMessage.addListener(
    async (request) => {
        if (request.message === "Save") {
            await chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                saveTab(tabs[0]);
            });
        }
})

chrome.runtime.onMessage.addListener(
    async (request) => {
        if (request.message === "Save all") {
            await chrome.tabs.query({currentWindow: true}, (tabs) => {
                for (let tab of tabs) {
                    saveTab(tab);
                }
            });
        }
})

function saveTab(tab) {
    let key = tab.url;
    chrome.storage.sync.get( [key], (result) => {
        if (Object.keys(result).length === 0) {
            chrome.storage.sync.set({[key] : tab}, () => {
                chrome.runtime.sendMessage({title : tab.title, url : tab.url, key : key});
            });
        }
    });
}

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.message === "Load") {
            chrome.storage.sync.get(null, (objOfKeys) => {
                for (var val in objOfKeys) {
                    let curTab = objOfKeys[val];
                    chrome.tabs.create({'url': curTab.url});
                }
            });
        }
})

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.message === "Clear") {
            clearStorage();
        }
    }
)

function clearStorage() {
    chrome.storage.sync.clear(() => {
        chrome.runtime.sendMessage({message: "empty"});
    });
}

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.message === "Display") {
            display();
        }
})

function display() { 
    chrome.storage.sync.get(null, (objOfKeys) => {
        for (var val in objOfKeys) {
            let curTab = objOfKeys[val];
            chrome.runtime.sendMessage({title : curTab.title, url : curTab.url});
        }
    });
}

chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.message === "Remove Saved Tab") {
            chrome.storage.sync.remove([request.key], () => {
                chrome.runtime.sendMessage({message: "empty"})
                display();
            });
        }
    }
)