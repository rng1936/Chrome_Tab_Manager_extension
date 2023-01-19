
chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "Save") {
            chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
                await saveTab(tabs[0]);
            });
        }
})

chrome.runtime.onMessage.addListener(
    function(request) {
        if (request.message === "Save all") {
            chrome.tabs.query({currentWindow: true}, async (tabs) => {
                for (let tab of tabs) {
                    await saveTab(tab);
                }
            });
        }
})

async function saveTab(tab) {
    let id = "id" + tab.id;
    chrome.storage.sync.get( [id], async (result) => {
        console.log(Object.keys(result).length);
        if (Object.keys(result).length === 0) {
            await chrome.storage.sync.set({[id] : tab});
            await chrome.runtime.sendMessage({title : tab.title, url : tab.url});
        }
    });
}

chrome.runtime.onMessage.addListener(
    async function(request) {
        if (request.message === "Load") {
            await chrome.storage.sync.get(null, async (objOfKeys) => {
                for (var val in objOfKeys) {
                    let curTab = objOfKeys[val]; 
                    await chrome.tabs.create({'url': curTab.url});
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
    await chrome.storage.sync.clear(() => {
        chrome.runtime.sendMessage({message: "empty"});
    });
}

chrome.runtime.onMessage.addListener(
    async function (request) {
        if (request.message === "Display") {
            await display();
        }
})

async function display() { 
    await chrome.storage.sync.get(null, async (objOfKeys) => {
        for (var val in objOfKeys) {
            let curTab = objOfKeys[val];
            await chrome.runtime.sendMessage({title : curTab.title, url : curTab.url});
        }
    });
}