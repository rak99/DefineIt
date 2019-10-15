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
    if (result.currentURL.url.indexOf('chrome://extensions/') === -1) {
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
    
        if (isDomainBlacklisted === true || isPageBlacklisted === true) {
            console.log(hostnameUrl, url);
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
                    function popupHandler(url) {
                        console.log(blacklists);
                        let indexOfItemToBeRemoved = blacklists.indexOf(url);
                        console.log(indexOfItemToBeRemoved);
                        let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                        console.log(url, reassembledArray);
                    };

                    siteSpecificEl.addEventListener('click', function() {
                        popupHandler(url);
                    }, false);
            
                    siteEntireEl.addEventListener('click', function() {
                        popupHandler(hostnameUrl);
                    }, false);

                } else if (isDomainBlacklisted === true) {
                    containerEl[0].remove();
                    popupPrefixEl[0].textContent = 'Un-Blacklist';
                    // !-- Handle if true and false, need to do the below execution then of push and stuff
                    siteEntireEl.textContent = hostnameUrl;
                    function popupHandler(url) {
                        console.log(blacklists);
                        let indexOfItemToBeRemoved = blacklists.indexOf(url);
                        console.log(indexOfItemToBeRemoved);
                        let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                        console.log(url, reassembledArray);
                    };

                    siteSpecificEl.addEventListener('click', function() {
                        popupHandler(url);
                    }, false);
            
                    siteEntireEl.addEventListener('click', function() {
                        popupHandler(hostnameUrl);
                    }, false);
                } else {
                    // isPageBlackListed === true
                    containerEl[1].remove();
                    popupPrefixEl[1].textContent = 'Un-Blacklist';
                    siteSpecificEl.textContent = url;

                    function popupHandler(url) {
                        console.log(blacklists);
                        let indexOfItemToBeRemoved = blacklists.indexOf(url);
                        console.log(indexOfItemToBeRemoved);
                        let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                        console.log(url, reassembledArray);
                    };

                    siteSpecificEl.addEventListener('click', function() {
                        popupHandler(url);
                    }, false);
            
                    siteEntireEl.addEventListener('click', function() {
                        popupHandler(hostnameUrl);
                    }, false);
                }
            }
    
        } else {
            if (siteSpecificEl) {
                console.log(hostnameUrl, url);
                // URL or domain not blacklisted
                // Do blacklist related things here
                for (let i = 0; i < popupPrefixEl.length; i++) {
                    popupPrefixEl[i].textContent = 'Blacklist';
                }
                siteSpecificEl.textContent = 'This Specific Page';
                siteEntireEl.textContent = hostnameUrl;

                function popupHandler(url) {
                    blacklists.push(url);
                    chrome.storage.local.set({blacklistedURLS: blacklists});
                    console.log(blacklists);
                };

                siteSpecificEl.addEventListener('click', function() {
                    popupHandler(url);
                }, false);
        
                siteEntireEl.addEventListener('click', function() {
                    popupHandler(hostnameUrl);
                }, false);
            }
        }
    } else {
        let containerEl = document.getElementsByClassName('defineIt-container')[0];
        if (containerEl) {
            containerEl.remove();
            let siteErrorTextNode = document.createTextNode('DefineIt Cannot Run on This Page');
            let siteErrorNode = document.createElement('p');
            siteErrorNode.className = 'defineIt-blacklist-popup-prefix';
            siteErrorNode.style.fontSize = '18px';
            siteErrorNode.style.marginTop = '10px';
            siteErrorNode.style.lineHeight = '100px';
            siteErrorNode.appendChild(siteErrorTextNode);
            console.log(siteErrorNode);
            containerEl = document.createElement('div');
            containerEl.className = 'defineIt-container';
            containerEl.appendChild(siteErrorNode);
            document.getElementsByTagName('body')[0].appendChild(containerEl);
            console.log(containerEl);
        };
    }
});