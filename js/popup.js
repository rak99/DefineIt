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