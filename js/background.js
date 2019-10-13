let currentURL = '';

/* chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'tabChanged') {
        console.log('tab has changed');
    }
}); */

console.log('background active');

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'resizePopup') {
            console.log('window resized!', request.dimensions);
            localStorage.setItem('defineIt-popupNode-dimensions', JSON.stringify(request.dimensions));
        }
    }
);

/* chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.log(tab, url);
  }); */

var myURL = "about:blank"; // A default url just in case below code doesn't work

chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log(activeInfo);
    let activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeTabId, function (tab) {
        currentURL = tab;
        console.log(currentURL);
        if (currentURL.url.indexOf('chrome://extensions') === -1) {
            chrome.storage.local.set({currentURL: currentURL});
        }
    });
})

/* if (document.getElementsByClassName('defineIt-container')[0]) {
    console.log(whatTab, document.getElementsByClassName('defineIt-container'));
    document.getElementsByClassName('defineIt-container')[0].textContent = whatTab;
} */

/* chrome.browserAction.onClicked.addListener(function(tabs) {
    console.log(tabs);
    chrome.browserAction.setPopup({
        tabId: tabs.id,
        popup: '../html/popup.html'
    });
}); */