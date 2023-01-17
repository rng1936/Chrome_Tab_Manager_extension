chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "Save") {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                saveTab(tabs[0]);
            });
        }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "Save all") {
            chrome.tabs.query({currentWindow: true}, async (tabs) => {
                for (let index in tabs) {
                    await saveTab(tabs[index]);
                }
            });
        }
});

async function saveTab(tab) {
    let key = tab.index;
    await chrome.storage.sync.set({ [key] : JSON.stringify(tab)});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "Load") {
            chrome.storage.sync.get(null, async (tabs) => {
                for (let tab in tabs) {
                    let current = JSON.parse(tabs[tab]); // tabs is the object and tab is the key
                    await chrome.tabs.create({'url': current.url});
                }
            });
        }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.message === "Clear") {
            clearStorage();
        }
    }
);

async function clearStorage() {
    await chrome.storage.sync.clear();
}
