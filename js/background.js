let currentURL = '';
let activeTabId = '';

console.log('background active');

var manifest = chrome.runtime.getManifest();
console.log(manifest.content_scripts[0].exclude_matches);

/* chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'resizePopup') {
            console.log('window resized!', request.dimensions);
            localStorage.setItem('defineIt-popupNode-dimensions', JSON.stringify(request.dimensions));
        }
    }
); */

var myURL = "about:blank"; // A default url just in case below code doesn't work

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(tabId, changeInfo, tab);
    currentURL = tab;
    chrome.storage.local.set({currentURL: currentURL});
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log(request);
            if (request.text === 'refreshContent') {
                let tabid = currentURL.id
                chrome.tabs.reload(currentURL.id, {bypassCache: false});
            }
        }
    ); 
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log(activeInfo);
    activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeTabId, function (tab) {
        currentURL = tab;
        console.log(currentURL);
        chrome.storage.local.set({currentURL: currentURL});
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if (request.text === 'refreshContent') {
                    chrome.tabs.reload(currentURL.id, {bypassCache: false});
                }
            }
        );
        return;
    });
});

// Listen for API Call from Content Script

chrome.storage.local.get(['API_CREDENTIALS'], function(result) {
    if (!result.API_CREDENTIALS) {
        chrome.storage.local.set({
            API_CREDENTIALS: { 
                id: 'ODhkNjY2Yjc=', 
                key: 'ZGMxZDA0M2U2NzlhNWQwNzJiYWY4ZjkxNjMzZDdmZDk=', 
                baseURL: 'aHR0cHM6Ly9vZC1hcGkub3hmb3JkZGljdGlvbmFyaWVzLmNvbS9hcGkvdjI=' }
            });
    } else {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
              if (request.text === "API_CALL") {
                var url = request.url;
                fetch(url, {
                    headers: {
                        'app_id': atob(result.API_CREDENTIALS.id),
                        'app_key': atob(result.API_CREDENTIALS.key)
                    }
                })
                .then(response => response.text())
                .then((text) => {
                    let parsedText = JSON.parse(text);
                    let word = parsedText.results[0].lexicalEntries[0].inflectionOf[0].text;
                    let language = 'en-gb';
                    fetch('https://od-api.oxforddictionaries.com/api/v2' + '/entries/' + language + '/' + word + '?fields=definitions&strictMatch=false', {
                        headers: {
                            'app_id': atob(result.API_CREDENTIALS.id),
                            'app_key': atob(result.API_CREDENTIALS.key)
                        }
                    })
                    .then(response => response.text())
                    .then((text) => {
                        //console.log(text);
                        console.log('HELLO');
                        chrome.tabs.sendMessage(activeTabId, {text: 'API_RESPONSE', data: text});
                    })
                    //chrome.runtime.sendMessage({text: 'API_RESPONSE', data: text})
                })
                .catch(error => console.log(error));
                return true;  // Will respond asynchronously.
              }
            }
        );
    }
});

// Set chrome.local api keys
/* chrome.storage.local.get(['API_CREDENTIALS'], function(result) {
    if (!result.API_CREDENTIALS) {
        chrome.storage.local.set({
            API_CREDENTIALS: { 
                id: 'ODhkNjY2Yjc=', 
                key: 'ZGMxZDA0M2U2NzlhNWQwNzJiYWY4ZjkxNjMzZDdmZDk=', 
                baseURL: 'aHR0cHM6Ly9vZC1hcGkub3hmb3JkZGljdGlvbmFyaWVzLmNvbS9hcGkvdjI=' }
            });
    };
}); */