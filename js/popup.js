console.log('popup active');
let currentURL = '';
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

    // 2 Statements to be met, which button is clicked, and if it's clicked, change contents of popop accordingly

    let a = document.createElement('a');
    let url = currentURL.currentURL.url;
    // url is the entire url, so this would be used to exclude the singular current page the user is on
    // in turn, this is the hostname of the url, for example www.wikipedia.org/*, so it would exclude all apges on this domain. 
    a.href = url;
    let hostnameUrl = a.hostname + '/*';
    let excludeArr = blacklists;
    let popupPrefixEl = document.getElementsByClassName('defineIt-blacklist-popup-prefix');
    let siteSpecificEl = document.getElementById('blacklist-site-specific');
    let siteEntireEl = document.getElementById('blacklist-site-entire');
    let containerEl = document.getElementsByClassName('defineIt-blacklist-container');

    function checkIfCurrentURLIsBlacklisted(url) {
        return blacklists.indexOf(url) > -1;
    }

    let isDomainBlacklisted = checkIfCurrentURLIsBlacklisted();
    let isPageBlacklisted = checkIfCurrentURLIsBlacklisted();

    if (isDomainBlacklisted === true || isPageBlacklisted === true) {
        // URL or domain is blacklisted
        // Do Un-Blacklist related things here
        // Change text as well, maybe 'Un-Blacklist This Page'
        if (containerEl.length > 0) {
            if (isDomainBlacklisted === true && isPageBlacklisted === true) {

                for (let i = 0; i < popupPrefixEl.length; i++) {
                    popupPrefixEl[i].textContent = 'Un-Blacklist';
                }
                siteSpecificEl.textContent = 'This Specific Page';
                siteEntireEl.textContent = hostnameUrl;

            } else if (isDomainBlacklisted === true) {
                containerEl[0].remove();
                popupPrefixEl[0].textContent = 'Un-Blacklist';
                siteSpecificEl.textContent = hostnameUrl;
            } else {
                // isPageBlackListed === true
                containerEl[1].remove();
                popupPrefixEl[1].textContent = 'Un-Blacklist';
                siteSpecificEl.textContent = url;
            }
        }

    } else {
        // URL or domain not blacklisted
        // Do blacklist related things here
        for (let i = 0; i < popupPrefixEl.length; i++) {
            popupPrefixEl[i].textContent = 'Blacklist';
        }
        siteSpecificEl.textContent = 'This Specific Page';
        siteEntireEl.textContent = hostnameUrl;
    }

    if (siteSpecificEl) { 

        function sliceAndConcatArray(arr, indexOfItemToBeRemoved) {
            // Give 2 arrays that you want to remove items from and return the removed array
            if (arr) {
                if (typeof indexOfItemToBeRemoved !== 'number') 
                    return console.error('error, number param is not a number');
                else {
                    let fromArrBeginTillMatch = arr.slice(0, indexOfItemToBeRemoved);
                    let fromArrExcludeTillEnd = arr.slice(indexOfItemToBeRemoved+1, arr.length);
                    return fromArrBeginTillMatch.concat(fromArrExcludeTillEnd);
                }
            }
        };

        function popupHandler(url) {
            let indexOfItemToBeRemoved = blacklists.indexOf(url);
            let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
        };

        siteSpecificEl.addEventListener('click', function() {
            popupHandler(url);
        }, false);

        siteEntireEl.addEventListener('click', function() {
            popupHandler(hostnameUrl);
        }, false);
    }

    if (siteSpecificEl) {
        let excludeArrIndex = excludeArr.indexOf(url)
        if (excludeArrIndex !== -1) {
            // If found
            if (popupPrefixEl.length > 0) {
                for (let elt of popupPrefixEl) {
                    elt.textContent = 'Un-Blacklist';
                }
            }
            siteSpecificEl.textContent = 'This Specific Page';
            siteSpecificEl.addEventListener('click', function() {
                console.log(excludeArr);
                let fromArrBeginTillMatch = excludeArr.slice(0, excludeArrIndex);
                let fromArrExcludeTillEnd = excludeArr.slice(excludeArrIndex+1, excludeArr.length);
                let concatedExcludeArr = fromArrBeginTillMatch.concat(fromArrExcludeTillEnd);
            });
        } else {
            // If not found
            if (popupPrefixEl.length > 0) {
                for (let elt of popupPrefixEl) {
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
            if (popupPrefixEl.length > 0) {
                for (let elt of popupPrefixEl) {
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
            if (popupPrefixEl.length > 0) {
                for (let elt of popupPrefixEl) {
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

