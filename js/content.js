/**
 * Popup content here
 * Make a nice theme, when text is highlighted the popup should show the word with a dropdown, the dropdown then displays all information about the word
 * Top has been disregarded in favour of an embedded dictionary page, atm hosted on Merriam Webster.
 */

// !-- Trim the selection to eliminate spaces, also - stop popup from executing if there are more than 2 words, or if the user wants maybe they can enable a beta mode where mutliple words can be selected and there will be multiple words
// !-- in the popup, all of which can be dropped down

// ! ----- Modes of requests ----- !

// Consider adding hover mode, check wikipedia functionality for idea on implementation

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

let popupNode = '';
let boldPosition = '';
let overlapWidth = 0;
let contextMenuExists = false;
let rangeNew = '';
let highlightNew = '';
let popupDimensionsGetFromSync = '';
let popupDimensionsResize = 0;
let syncedPopupWidth = 0;
let syncedPopupHeight = 0;
let parsedStringifiedResult = 0;

// Find element's position relative to the document (so if scrolled down this is very useful)
function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
};

function selectElement(element) {
    if (window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        var range = document.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
    } else if (document.selection) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(element);
        textRange.select();
    }
};

function doThis() {
    console.log('Hellooooooooooooooooo squadR');
}

// !-- MAKE SURE NOT TO SEARCH FOR NUMBERS
/* 
document.addEventListener('scroll', function(e) {
    if (document.getElementById('defineIt-popupNode')) {
        document.getElementById('defineIt-popupNode').remove();
        window.removeEventListener('mousedown', showPopup, false);
        let popupNodePosition = popupNode.getBoundingClientRect();
        popupNode.style.left = (boldPosition.left - popupNodePosition.left + 'px') + popupNode.style.width;
    };
}); */

window.addEventListener('contextmenu', function() {
    contextMenuExists = true;
});

function getSelectionText(e) {

    var body = document.body,
    html = document.documentElement;

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight 
        );
    var documentWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
         );

    // !-- TODO - Add scroll to base feature
    // !-- Some selected words are not in their origin/base form, e.g playing is selected, but the popup website I use, Merriam-Webster, starts at the origin/base word
    // !-- ALSO, if the popupHeight is higher than the bottom left on the page, make popup go top rather than bottom
    // !-- So check
    // !!!-- Top Done --!!!
    // !-- Now, overLapWidth thingy isn't working anymore, fix it
    // !-- I belive Top is also fixed, nice.
    // !-- Fix non text only nodes selecting space and it causing an error
    // !-- Fixed width and height based on media query
    // !-- New idea is to make iframe resizeable by user, size gets saved to chrome.storage.sync or localStorage on background.js on mouseup it gets saved, 
    // !-- then fetch it from there if it exists
    // !-- Also want to add a popup that lets you specific page or whole href, also add unblacklist if site is blacklisted think I said it here somewhere already
    // !-- Maybe add a keybind to it 
    // !-- New feature to add is on right click (context menu) or e.which === 3, make opacity for popup very low, also maybe by default make it low and add a 
    // !-- Node.onhover = function() = opacity = 1, but by default make it like 0.3 or something
    // !-- ----------------- 4 THINGS TO FOCUS ON NOW -----------------
    // !-- New error, selecting plain text without whitespace then with, causes error FIX
    // !-- Fixed for now I think.
    // !-- Save resize size to localstorage or chrome.storage.sync
        // !-- Check https://developers.google.com/web/updates/2016/10/resizeobserver for help on this
        // !-- Works now but previous fix of pushing iframe to the left when it overlapped to the right now fails, look into it, consider dropping the feature.
        // !-- BELOW IS LIKELY THE ISSUE
        // !-- There's a bunch of unmodular code that relies on a linear width and height, fix it as it's bad principles.
        // !-- fixed
    // !-- Blacklist pages from extensions
    // !-- check words for multiple dictionaries
    // !-- MAYBE ADD A sponsored background-image or something
    // in this case, play. Maybe find a way to search for the word 'Play' by searching for indexOf('Play') and the nodeName has to be an <h1> or something,
    // do getBoundingClientRect() on it and scroll the popup down there, I'm pretty sure it's easy to do.

    if (e.which === 1) {
        var text = "";
        if (window.getSelection && window.getSelection().toString().trim().length > 0) {
            // !-- IMPORTANT, STOP DESELECTION SO USERS CAN'T COPY WHEN HIGHLIGHTED
    
            // Rework to use x and y rather than document I think... 
            text = window.getSelection().toString().trim();
            console.log(text);
            let selectedDOM = window.getSelection().focusNode;
            // !-- This below method may be inconsistent if there are more versions of the dom element surrounding the selection, this method searches the entire body for the text, and assumes it appears only once.
            // Use below as reference, with the emphasis on range as it allows dom insertion at the specific select.
            let highlight = window.getSelection(),
            bold = document.createElement('b'),
            range = highlight.getRangeAt(0);
            bold.id = 'DefineItTextToBold';
            bold.style.fontWeight = 'unset';
            // bold.getBoundingClientRect();
            
            // Begin popup ---
            let popupNode = document.createElement('iframe');
            popupNode.className = "selectedWord";

            chrome.storage.local.get(['popupDimensions'], function(result) {
                console.log('Value currently is ' + JSON.stringify(result));
                parsedStringifiedResult = JSON.parse(JSON.stringify(result));
                console.log(parsedStringifiedResult);
                syncedPopupWidth = parsedStringifiedResult.popupDimensions.width;
                syncedPopupHeight = parsedStringifiedResult.popupDimensions.height;
                if (syncedPopupWidth !== 0 && syncedPopupHeight !== 0) {
                    popupNode.style.width = syncedPopupWidth + 'px';
                    popupNode.style.height = syncedPopupHeight + 'px';
                } else {
                    popupNode.style.width = '350px';
                    popupNode.style.height = '500px';
                }
            });
            // !-- Add localStorage capture of resize

            // !-- New idea, maybe try a bunch of dictionary websites, either at the same time, first one with a 200 response or something is used, or by order of if 404;
            // !-- Like promises
            popupNode.src = `https://www.merriam-webster.com/dictionary/${text}`;
            fetch(popupNode.src, { 
                mode: 'cors',
                headers: {
                    "Access-Control-Allow-Origin" : "*"
                  },
             })
            .then((res) => {
                if (res.status !== 404) {
                    console.log(range.commonAncestorContainer.nodeName !== "P");
                    console.log(range);
                    if (range.startContainer.nodeName !== '#text') {
                        console.log(range);
                        range.surroundContents(bold);
                        // !-- Gonna have to change this to do bottom way as well maybe
                        boldPosition = getCoords(bold);
                    } else {
                        console.log(range);
                        let selectedText = window.getSelection().toString().trim();
                        let selectedTextLength = window.getSelection().toString().trim().length;
                        console.log(selectedText);
                        let nodeOuterHTML = range.startContainer.parentElement.outerHTML;
                        console.log(nodeOuterHTML);
                        console.log(nodeOuterHTML.indexOf(selectedText));
                        let selectedTextIndex = nodeOuterHTML.indexOf(selectedText);
                        let selectedTextToBold = `<b id="DefineItTextToBold">${selectedText}</b>`;
                        console.log(range.startContainer.nextSibling.outerHTML);
                        range.startContainer.parentElement.outerHTML = nodeOuterHTML.slice(0, selectedTextIndex) + 
                        selectedTextToBold + 
                        nodeOuterHTML.slice(selectedTextIndex + selectedTextLength, nodeOuterHTML.length);
                        console.log(nodeOuterHTML);
                        let newBoldElement = document.getElementById('DefineItTextToBold');
                        boldPosition = getCoords(newBoldElement);
                        selectElement(newBoldElement);
                        console.log(boldPosition);
                            highlightNew = window.getSelection(),
                            rangeNew = highlight.getRangeAt(0);
                    }
                    // !-- Decide if we want to make height and width not a constant, atm getting height and width at this stage doesn't work, what we could do is define
                    // !-- it with js, that we can access it here, problem is media queries work nicely  
                    // Styling
                    popupNode.id = 'defineIt-popupNode';
                    popupNode.addEventListener('mouseenter', function(e) {
                        popupNode.style.opacity = '1.0';
                    });
                    popupNode.addEventListener('mouseleave', function(e) {
                        popupNode.style.opacity = '';
                    });
                    // !-- Old way that gets cropped --!
                    // range.insertNode(popupNode);
                    document.getElementsByTagName('body')[0].insertBefore(popupNode, document.getElementsByTagName('body')[0].firstChild);
                    var ro = new ResizeObserver( entries => {
                        for (let entry of entries) {
                          const cr = entry.contentRect;
                          console.log('Element:', entry.target);
                          console.log(`Element size: ${cr.width}px x ${cr.height}px`);
                          console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
                          if (cr.width !== 0 || cr.height !== 0) {
                            popupDimensionsResize = cr;
                          }
                        }
                        chrome.runtime.sendMessage({text: 'resizePopup', dimensions: { width: popupDimensionsResize.width, height: popupDimensionsResize.height }});
                        chrome.storage.local.set({popupDimensions: { width: popupDimensionsResize.width, height: popupDimensionsResize.height}}, function() {
                            console.log('Value is set to ' + JSON.stringify(popupDimensionsResize));
                        });
                        return entries;
                      });
                      // Observe one or multiple elements
                    ro.observe(popupNode);
                    let popupNodePositionStart = popupNode.getBoundingClientRect();
                    let popupNodeLeftToRightStart = popupNodePositionStart.x + popupNodePositionStart.width;
                    let popupNodeTopToBottomStart = popupNodePositionStart.y + popupNodePositionStart.height;
                    popupNode.style.left = (boldPosition.left) + 'px';
                    let overlapHeight = boldPosition.top - documentHeight + parseInt(popupNode.style.height);
                    if ( (boldPosition.top - documentHeight + parseInt(popupNode.style.height)) > -18) {
                        // Trigger from top
                        popupNode.style.top = boldPosition.top - parseInt(popupNode.style.height) + 15 - 25 + 'px';
                    } else {
                        popupNode.style.top = boldPosition.top - 15 + 'px';
                    }
                    overlapWidth = documentWidth - popupNode.getBoundingClientRect().x;
                    let rangeNode = range.startOffset;
                    if ( overlapWidth < parseInt(popupNode.style.width)+26 ) {
                            if (document.getElementById('defineIt-popupNode')) {
                                popupNode.style.left = parseInt(popupNode.style.left) - (parseInt(popupNode.style.width)+26 - overlapWidth) + 'px';
                            }
                    }
                    const showPopup = (e) => {
                        if (e.which === 1) {
                            // !-- Remove if else later if I decide a single click outside popup should close with contextMenu open
                            if (contextMenuExists === true) {
                                contextMenuExists = false;
                            } else {
                                if ( document.getElementById('defineIt-popupNode') ) {
                                    let popupNodePositions = popupNode.getBoundingClientRect();
                                    let popupNodeLeftToRight = popupNodePositions.x + popupNodePositions.width;
                                    let popupNodeTopToBottom = popupNodePositions.y + popupNodePositions.height;
                                    var x = event.clientX;     // Get the horizontal coordinate
                                    var y = event.clientY;     // Get the vertical coordinate
                                    // rangeNew.contents().unwrap();
                                    if (document.getElementById('DefineItTextToBold')) {
                                        document.getElementById('DefineItTextToBold').removeAttribute('id');
                                        console.log(rangeNew);
                                        $(rangeNew.commonAncestorContainer).contents().unwrap();
                                    };
                                    // !-- Above fixed what bottom may be able to but better, not sure yet
                                    // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);
                                    // !-- document.execCommand("bold", false, null)
                                    $(bold).contents().unwrap();
                                    var coor = "X coords: " + x + ", Y coords: " + y;
                                    if ( ( x < (popupNodePositions.x) || x > popupNodeLeftToRight ) || y < (popupNodePositions.y) || y > popupNodeTopToBottom ) {
                                        // range.startContainer.childNodes[rangeNode].remove();
                                        document.getElementById('defineIt-popupNode').remove();
                                        
                                        window.removeEventListener('mousedown', showPopup, false);
                                        let popupNodePosition = popupNode.getBoundingClientRect();
                                        popupNode.style.left = (boldPosition.left - popupNodePosition.left + 'px') + popupNode.style.width;
                                    }
                                }
                            }
                        } else {
                            contextMenuExists = false;
                        }
                    };
                    window.addEventListener('mousedown', showPopup, false);
                    //$(bold).contents().unwrap();
                    // End popup ---
                } else {
                    window.addEventListener('mousedown', function(e) {
                        if (e.which === 1) {
                            $(bold).contents().unwrap();
                        }
                    });
                }
            });
        } else if (document.selection && document.selection.type != "Control" && document.selection.createRange().text.length > 0) {
            text = document.selection.createRange().text;
            let selectedDOM = document.selection.createRange().focusNode;
            // Begin popup ---
            let popupNode = document.createElement("div");
            popupNode.className = "selectedWord";
            let selectedWordTextNode = document.createTextNode(`${text}`);
            popupNode.appendChild(selectedWordTextNode);
            selectedDOM.appendChild(popupNode);
            const showPopup = () => {
                selectedDOM.lastChild.remove();
                window.removeEventListener('click', showPopup, false);
            };
            window.addEventListener('click', showPopup, false);
            // End popup ---
        }
        return text;
    }
}

window.addEventListener('mouseup', function(e) {
    stopFunction = false;
    getSelectionText(e);
});

