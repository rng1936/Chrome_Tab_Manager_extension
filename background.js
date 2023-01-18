
chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "Save") {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                saveTab(tabs[0]);
            });
        }
})

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "Save all") {
            chrome.tabs.query({currentWindow: true}, async (tabs) => {
                for (let index in tabs) {
                    await saveTab(tabs[index]);
                }
            });
        }
})

async function saveTab(tab) {
    let key = tab.index;
    await chrome.storage.sync.set({ [key] : JSON.stringify(tab)});
    await display();
}

chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.message === "Load") {
            await chrome.storage.sync.get(null, async (keys) => {
                for (let tab in keys) {
                    let current = JSON.parse(keys[tab]); // parsing tab object associated with key
                    await chrome.tabs.create({'url': current.url});
                }
            });
        }
})

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "Clear") {
            clearStorage();
        }
    }
)

async function clearStorage() {
    await chrome.storage.sync.clear();
    await chrome.runtime.sendMessage({message: "empty"});
}

chrome.runtime.onMessage.addListener(
    async function (request) {
        if (request.message === "Display") {
            await display();
        }
})

async function display() {
    await chrome.storage.sync.get(null, async (keys) => {
        for (let tab in keys) {
            let current = JSON.parse(keys[tab]);
            await chrome.runtime.sendMessage({title : current.title, url : current.url});
        }
    });
}