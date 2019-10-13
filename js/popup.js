console.log('popup active');
let currentURL = '';

chrome.storage.local.get(['currentURL'], function(result) {
    console.log('Value currently is ' + JSON.stringify(result));
    currentURL = result;
    console.log(currentURL.currentURL.url);
    document.getElementById('blacklist-site').textContent = 'Blacklist: ' + currentURL.currentURL.url;
    // !-- Do unblacklist aswell for specific site, only if the url is an exact match, or a partial match if it excluded the whole page, should be easy
    // !-- array.pop(urlindex) or something...
});

/* if (document.getElementById('defineIt-blacklist-sites-button')) {
    document.getElementById('defineIt-blacklist-sites-button').addEventListener('click', hello);
} */

/* chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'blacklistSite') {
            console.log('message found');
            //currentWindowUrl = request.tabUrl;
            //console.log(currentWindowUrl);
            //chrome.runtime.sendMessage({text: 'blacklistSite', tabUrl: currentWindowUrl});
        }
    }
); */

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('message found', request);
        if (request.text === 'tabChanged') {
            console.log('message found', request);
            let currentWindowUrl = request.tabUrl;
            console.log(currentWindowUrl);
            chrome.runtime.sendMessage({text: 'blacklistSite', tabUrl: currentWindowUrl});
        }
    }
);

/* chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        if (request.text === 'tabChanged') {
            console.log('message found');
            console.log(request);
            if (document.getElementById('defineIt-blacklist-sites-button')) {
                document.getElementById('defineIt-blacklist-sites-button').addEventListener('click', function() {
                    console.log('Helloooooooooooooo');
                    // console.log(currentWindowUrl);
                    // chrome.runtime.sendMessage({text: 'blacklistSite', tabUrl: tabUrl});
                });
            }
            // currentWindowUrl = request.tabUrl;
            // console.log(currentWindowUrl);
            // chrome.runtime.sendMessage({text: 'blacklistSite', tabUrl: currentWindowUrl});
        }
    }
); */

/* chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'tabChanged') {
            console.log('message found');
            let currentWindowUrl = request.tabUrl;
            console.log(currentWindowUrl);
            chrome.runtime.sendMessage({text: 'blacklistSite', tabUrl: currentWindowUrl});
        }
    }
); */

/* 
if (document.getElementById('defineIt-blacklist-sites-button')) {
    console.log(document.getElementById('defineIt-blacklist-sites-button').textContent);
    console.log(whatTab);
    // document.getElementById('defineIt-blacklist-sites-button').textContent = whatTab;
} */
// document.getElementById('defineIt-blacklist-sites-button').textContent = whatTab;

