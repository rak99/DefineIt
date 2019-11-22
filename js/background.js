let currentURL = '';
let activeTabId = '';

console.log('background active');

var manifest = chrome.runtime.getManifest();
console.log(manifest.content_scripts[0].exclude_matches);

let count = 0;

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

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.text === "API_CALL") {
          // !-- Use lemmas to check if valid word, only then show icon, sell word data to companies to counteract api costs, then if clicked do second call
          // !-- and show popup, find a way to monetize that as well.
/*         if (count <= 5) {

        } else {
            chrome.tabs.sendMessage(timeout, {text: 'API_Timeout', duration: 60});
            setTimeout(() => {
                count = 0;
            }, 60000);
        } */
        var url = request.url;
        count+=1;
/*         chrome.storage.local.get(['API_CREDENTIALS'], function(result) {
            console.log(result);
            if (!result.API_CREDENTIALS) {
                chrome.storage.local.set({
                    API_CREDENTIALS: { 
                        id: 'ODhkNjY2Yjc=', 
                        key: 'ZGMxZDA0M2U2NzlhNWQwNzJiYWY4ZjkxNjMzZDdmZDk=', 
                        baseURL: 'aHR0cHM6Ly9vZC1hcGkub3hmb3JkZGljdGlvbmFyaWVzLmNvbS9hcGkvdjI=' }
                    });
            } else {
            }
        }); */
        fetch(url, {
            headers: {
                'app_id': atob('ODhkNjY2Yjc='),
                'app_key': atob('ZGMxZDA0M2U2NzlhNWQwNzJiYWY4ZjkxNjMzZDdmZDk=')
            }
        })
        .then((response) => {
            if (response.status !== 404)
                return response.text()
        })
        .then((text) => {
            if (text) {
                let parsedText = JSON.parse(text);
                let word = parsedText.results[0].lexicalEntries[0].inflectionOf[0].text;
                if (word.toLowerCase() === 'was') {
                    word = 'be';
                }
                let language = 'en-gb';
                // !-- Add examples to fields, put it in each lexicalCategory
                fetch('https://od-api.oxforddictionaries.com/api/v2' + '/entries/' + language + '/' + word + '?fields=definitions,examples&strictMatch=false', {
                    headers: {
                        'app_id': atob('ODhkNjY2Yjc='),
                        'app_key': atob('ZGMxZDA0M2U2NzlhNWQwNzJiYWY4ZjkxNjMzZDdmZDk=')
                    }
                })
                .then(response => response.text())
                .then((text) => {
                    //console.log(text);
                    chrome.tabs.sendMessage(activeTabId, {text: 'API_RESPONSE', data: text});
                })
                //chrome.runtime.sendMessage({text: 'API_RESPONSE', data: text})
            }
        })
        .catch(error => console.log(error));
        return true;  // Will respond asynchronously.
      }
    }
);

// Send spinner.html to content.js on request

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "read_file") {
        console.log('readFile');
        let url = chrome.extension.getURL("html/spinner.html");
        fetch(url, {
            headers: {
                dataType: 'html',
                'Content-Type': 'text/html'
            }
        }).then(response => response.text())
        .then((html) => {
            sendResponse({html: html});
        });
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