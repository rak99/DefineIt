let currentURL = '';
//let blacklists = '';

chrome.storage.local.get(['blacklistedURLS'], function(res) {
    //console.log('Currently blacklisted URLS are', res);
    if (res.blacklistedURLS) {
        blacklists = res.blacklistedURLS;
    } else {
        blacklists = [];
    }
});

// Stop f12 and right click from working on popup

// !-- Consider using .setPopup rather than all this muckery

chrome.storage.local.get(['currentURL'], function(result) {
    //console.log('Value currently is ' + JSON.stringify(result));
    if (result.currentURL.url.indexOf('chrome://extensions/') === -1) {
        currentURL = result;
        //console.log(currentURL.currentURL.url);

        if (document.getElementById('defineItBody')) {
            document.getElementById('defineItBody').addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            document.getElementById('defineItBody').addEventListener('keydown', function(e) {
                if(e.which === 123){
                    return false;
                 };
            });
        };
        // Use clever tactic to extract hostname from url by turning it into a a element, setting the href attribute to the url we want
        // the a element hasa built in hostname property that extracts it from the href, so all that's left is to use a.hostname and voila!
    
        // 2 Statements to be met, which button is clicked, and if it's clicked, change contents of popop accordingly
    
        let a = document.createElement('a');
        let url = currentURL.currentURL.url;
        // url is the entire url, so this would be used to exclude the singular current page the user is on
        // in turn, this is the hostname of the url, for example www.wikipedia.org/*, so it would exclude all apges on this domain. 
        a.href = url;
        let hostnameUrl = a.hostname + '/';
        let excludeArr = blacklists;
        let popupPrefixEl = document.getElementsByClassName('defineIt-blacklist-popup-prefix');
        let popupPrefixSpecific = document.getElementById('specificBlacklist');
        let popupPrefixDomain = document.getElementById('domainBlacklist');
        let siteSpecificEl = document.getElementById('blacklist-site-specific');
        let siteEntireEl = document.getElementById('blacklist-site-entire');
        let containerEl = document.getElementsByClassName('defineIt-blacklist-container');
    
        function checkIfCurrentURLIsBlacklisted(url) {
            return blacklists.indexOf(url) > -1;
        }

        function refreshPopup() {
            document.getElementById('defineIt-container-id').style.display = 'none';
            document.getElementById('refreshIconContainer').style.display = 'flex';
            document.getElementById('refreshButtonID').addEventListener('click', function() {
                //console.log('clicked');
                chrome.runtime.sendMessage({text: 'refreshContent'});
                window.close();
            });
        }
    
        let isDomainBlacklisted = checkIfCurrentURLIsBlacklisted(hostnameUrl);
        let isPageBlacklisted = checkIfCurrentURLIsBlacklisted(url);
        //console.log('Page' + isPageBlacklisted, 'Domain' + isDomainBlacklisted);

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
            //console.log(hostnameUrl, url);
            // URL or domain is blacklisted
            // Do Un-Blacklist related things here
            // Change text as well, maybe 'Un-Blacklist This Page'

            // Both Un-blacklisted
            // 1 blacklisted 1 not blacklisted
            // Both Blacklisted

            if (containerEl.length > 0) {
                // Both Blacklisted
                if (isDomainBlacklisted === true && isPageBlacklisted === true) {
                    //console.log('Both domain and page are blacklisted');
                    //popupPrefixSpecific.textContent = 'Un-Blacklist';
                    popupPrefixDomain.textContent = 'Un-Blacklist';
                    //siteSpecificEl.textContent = 'This Specific Page';
                    siteEntireEl.textContent = hostnameUrl;
                    function popupHandler(url) {
                        if (blacklists.indexOf(url) !== -1) {
                            //console.log(blacklists);
                            let indexOfItemToBeRemoved = blacklists.indexOf(url);
                            //console.log(indexOfItemToBeRemoved);
                            let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                            chrome.storage.local.set({blacklistedURLS: reassembledArray});
                            //console.log(url, reassembledArray);
                            refreshPopup();
                        } else {
                            //console.log('tried to unblacklist but' + url + 'was never inside blacklists', blacklists);
                        }
                    };

                    siteSpecificEl.addEventListener('click', function() {
                        popupHandler(url);
                    }, false);
            
                    siteEntireEl.addEventListener('click', function() {
                        popupHandler(hostnameUrl);
                    }, false);

                } else if (isDomainBlacklisted === true) {
                    //console.log('Only domain is blacklisted');
                    // Only Domain blacklisted, aka isPageSpecific === false
                    popupPrefixDomain.textContent = 'Un-Blacklist';
                    // !-- Handle if true and false, need to do the below execution then of push and stuff
                    siteEntireEl.textContent = hostnameUrl;
                    popupPrefixSpecific.textContent = 'Blacklist';
                    siteSpecificEl.textContent = 'This Specific Page';
                    function popupHandler(url) {
                        //console.log(blacklists);
                        if (blacklists.indexOf(url) === -1) {
                            blacklists.push(url);
                        } else {
                            let indexOfItemToBeRemoved = blacklists.indexOf(url);
                            //console.log(indexOfItemToBeRemoved);
                            let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                            chrome.storage.local.set({blacklistedURLS: reassembledArray});
                            //console.log(url, reassembledArray);
                        }
                        refreshPopup();
                    };

                    siteSpecificEl.addEventListener('click', function() {
                        popupHandler(url);
                    }, false);
            
                    siteEntireEl.addEventListener('click', function() {
                        popupHandler(hostnameUrl);
                    }, false);
                } else {
                    //console.log('Only page is blacklisted');
                    // isPageBlackListed === true
                    popupPrefixSpecific.textContent = 'Un-Blacklist';
                    popupPrefixDomain.textContent = 'Blacklist';
                    // !-- Handle if true and false, need to do the below execution then of push and stuff
                    siteEntireEl.textContent = hostnameUrl;
                    siteSpecificEl.textContent = 'This Specific Page';
                    function popupHandler(url) {
                        //console.log(blacklists);
                        if (blacklists.indexOf(url) === -1) {
                            blacklists.push(url);
                        } else {
                            let indexOfItemToBeRemoved = blacklists.indexOf(url);
                            //console.log(indexOfItemToBeRemoved);
                            let reassembledArray = sliceAndConcatArray(blacklists, indexOfItemToBeRemoved);
                            chrome.storage.local.set({blacklistedURLS: reassembledArray});
                            //console.log(url, reassembledArray);
                        }
                        refreshPopup();
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
            //console.log('No blacklists');
            if (siteSpecificEl) {
                //console.log(hostnameUrl, url);
                // URL or domain not blacklisted
                // Do blacklist related things here
                popupPrefixSpecific.textContent = 'Blacklist';
                popupPrefixDomain.textContent = 'Blacklist';
                siteSpecificEl.textContent = 'This Specific Page';
                siteEntireEl.textContent = hostnameUrl;

                function popupHandler(url) {
                    if (blacklists.indexOf(url) === -1) {
                        blacklists.push(url);
                        chrome.storage.local.set({blacklistedURLS: blacklists});
                        //console.log(blacklists);
                        refreshPopup();
                    } else {
                        //console.log('tried to blacklist but' + url + 'was already inside blacklists', blacklists);
                    }
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
            //console.log(siteErrorNode);
            containerEl = document.createElement('div');
            containerEl.className = 'defineIt-container';
            containerEl.appendChild(siteErrorNode);
            document.getElementsByTagName('body')[0].appendChild(containerEl);
            //console.log(containerEl);
        };
    }
});