console.log('popup active');
let currentURL = '';
var manifest = chrome.runtime.getManifest();
console.log(manifest.content_scripts[0].exclude_matches);
let blacklists = '';

chrome.storage.local.get(['blacklistedURLS'], function(res) {
    console.log('Currently blacklisted URLS are', res);
    if (res.blacklistedURLS) {
        blacklists = res.blacklistedURLS;
    } else {
        blacklists = [];
    }
})

chrome.storage.local.get(['currentURL'], function(result) {
    console.log('Value currently is ' + JSON.stringify(result));
    currentURL = result;
    console.log(currentURL.currentURL.url);
    // Use clever tactic to extract hostname from url by turning it into a a element, setting the href attribute to the url we want
    // the a element hasa built in hostname property that extracts it from the href, so all that's left is to use a.hostname and voila!
    let a = document.createElement('a');
    let url = currentURL.currentURL.url;
    a.href = url;
    let hostnameUrl = a.hostname;
    let excludeArr = blacklists;
    let popopPrefixEl = document.getElementsByClassName('defineIt-blacklist-popup-prefix');
    let siteSpecificEl = document.getElementById('blacklist-site-specific');
    let siteEntireEl = document.getElementById('blacklist-site-entire');
    if (siteSpecificEl) {
        let excludeArrIndex = excludeArr.indexOf(url)
        if (excludeArrIndex !== -1) {
            // If found
            if (popopPrefixEl.length > 0) {
                for (let elt of popopPrefixEl) {
                    elt.textContent = 'Un-Blacklist';
                }
            }
            siteSpecificEl.textContent = 'This Specific Page';
            siteSpecificEl.addEventListener('click', function() {
                console.log(excludeArr);
                let fromArrBeginTillMatch = excludeArr.slice(0, excludeArrIndex);
                let fromArrExcludeTillEnd = excludeArr.slice(excludeArrIndex+1, excludeArr.length);
                let concatedExcludeArr = fromArrBeginTillMatch.concat(fromArrExcludeTillEnd);
                manifest.content_scripts[0].exclude_matches = concatedExcludeArr;
                console.log(manifest.content_scripts[0].exclude_matches);
            });
        } else {
            // If not found
            if (popopPrefixEl.length > 0) {
                for (let elt of popopPrefixEl) {
                    elt.textContent = 'Blacklist';
                }
            }
            siteSpecificEl.textContent = 'This Specific Page';
            siteSpecificEl.addEventListener('click', function() {
                console.log(excludeArr);
                //manifest.content_scripts[0].exclude_matches.push(url);
                blacklists.push(url)
                chrome.storage.local.set({blacklistedURLS: blacklists});
                //console.log(manifest.content_scripts[0].exclude_matches);
            });
        }
    }
    if (document.getElementById('blacklist-site-entire')) {
        let excludeArrIndex = excludeArr.indexOf(hostnameUrl + '/*');
        if (excludeArrIndex !== -1) {
            // If found
            if (popopPrefixEl.length > 0) {
                for (let elt of popopPrefixEl) {
                    elt.textContent = 'Un-Blacklist';
                }
            }
            siteEntireEl.textContent = hostnameUrl;
            siteEntireEl.addEventListener('click', function() {
                console.log(excludeArr);
                let fromArrBeginTillMatch = excludeArr.slice(0, excludeArrIndex);
                let fromArrExcludeTillEnd = excludeArr.slice(excludeArrIndex+1, excludeArr.length);
                let concatedExcludeArr = fromArrBeginTillMatch.concat(fromArrExcludeTillEnd);
                manifest.content_scripts[0].exclude_matches = concatedExcludeArr;
                console.log(manifest.content_scripts[0].exclude_matches);
            }); 
        } else {
            // If not found
            if (popopPrefixEl.length > 0) {
                for (let elt of popopPrefixEl) {
                    elt.textContent = 'Blacklist';
                }
            }
            siteEntireEl.textContent = hostnameUrl;
            siteEntireEl.addEventListener('click', function() {
                console.log(excludeArr);
                manifest.content_scripts[0].exclude_matches.push(hostnameUrl + '/*');
                console.log(manifest.content_scripts[0].exclude_matches);
            });
        }
    };
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

