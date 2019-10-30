/**
 * Popup content here
 * Make a nice theme, when text is highlighted the popup should show the word with a dropdown, the dropdown then displays all information about the word
 * Top has been disregarded in favour of an embedded dictionary page, atm hosted on Merriam Webster.
 */

// !-- Trim the selection to eliminate spaces, also - stop popup from executing if there are more than 2 words, or if the user wants maybe they can enable a beta mode where mutliple words can be selected and there will be multiple words
// !-- in the popup, all of which can be dropped down
// !-- IMPORTANT -- ADD TIMEOUT IF MORE THAN LET'S SAY 3 WORDS ARE SELECTED IN 30 SECONDS, maybe add timeout for one request every 60 sec and
// !--  if you pay $1 unlimited access
// !-- Footernode is currently child in selectedWord, put it in body maybe too or find a way to make the ad part not scrollable so it's always visible
// !-- Cache definitions or something so double definition doesn't make api calls, force it to refresh after a few days though
// !-- Disable icon mode
// !-- Scratch the resizer for now
// !-- To find, ctrl + f 'Scratch the resizer for now' to undo it

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

// Listen for refresh from popup.js

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
let span = '';
// Add multi-language later
let language = 'en-gb';
let fullAPIURL = '';
let newBoldElement = '';
let rangeWindow = '';
let bold = '';
let isIconActive = false;
// Vars for popup content
let lexicalCategoryArr = [];
// Order of definitions might be something I still need to figure out
let definitions = [];
let APIword = '';
let wordNode = '';
let lexicalCategoryDiv = '';
let iconPopupExists = false;
let pageIsBlacklisted = true;

function popupIcon() {
    console.log('SHOUDLN\'T HAPPEN AFTER ICON CLICK');
    isIconActive = true;
    var body = document.body,
    html = document.documentElement;

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight 
        );
    var documentWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
         );
    console.log(boldPosition);
    let iconPopup = popupNode;
    iconPopup.id = 'defineIt-iconNode';
    iconPopup.className = 'popupIcon';
    iconPopup.addEventListener('mouseenter', function(e) {
        iconPopup.style.opacity = '1.0';
    });
    iconPopup.addEventListener('mouseleave', function(e) {
        iconPopup.style.opacity = '';
    });
    // !-- Old way that gets cropped --!
    // range.insertNode(iconPopup);

    let containerNode = document.createElement('div');
    containerNode.className = 'containerNode';
    // SelectedWord Node, put the    header, middle, footer

    // Then header div 
    let headerNode = document.createElement('div');
        headerNode.className = 'headerNode';

        // with 1 img child 1 div rightside child
        // Rightside div could possibly be ad

        let imgNode = document.createElement('img');
        imgNode.className = 'imgNode';
        imgNode.src = 'https://i.imgur.com/XKkHJ8K.png';
        headerNode.appendChild(imgNode);

        let flexRightNode = document.createElement('div');
        flexRightNode.className = 'flexRightNode';
        headerNode.appendChild(flexRightNode);
        containerNode.appendChild(headerNode);

    // Then middle div container
    let middleNode = document.createElement('div');

        middleNode.className = 'middleNode';
        middleNode.appendChild(wordNode);
        middleNode.appendChild(lexicalCategoryDiv);

        middleNode.appendChild(definitionsNode);
        containerNode.appendChild(middleNode);
        // Not sure what this should contain yet
        // Word
        // lexicalCategory
        // Definitions
        // AND A LOOP for everyone

    // Then footer container, potentially with an ad
    let footerNode = document.createElement('div');
        footerNode.className = 'footerNode';

        // !-- UNDO THIS LATER FOR ADS

    // containerNode.appendChild(footerNode);

    document.getElementsByTagName('body')[0].insertBefore(iconPopup, document.getElementsByTagName('body')[0].firstChild);
    const showPopup = (e) => {
        console.log('DONT HAPPEN AFTER LOGO CLICK');
        if (e.which === 1 && iconPopupExists === true) {
            // !-- Remove if else later if I decide a single click outside popup should close with contextMenu open
            if (contextMenuExists === true) {
                contextMenuExists = false;
            } else {
                if ( document.getElementById('defineIt-iconNode') ) {
                    let iconPopupPositions = iconPopup.getBoundingClientRect();
                    let iconPopupLeftToRight = iconPopupPositions.x + iconPopupPositions.width;
                    let iconPopupTopToBottom = iconPopupPositions.y + iconPopupPositions.height;
                    var x = event.clientX;     // Get the horizontal coordinate
                    var y = event.clientY;     // Get the vertical coordinate

                    console.log(iconPopupPositions);
                    // rangeNew.contents().unwrap();
                    if (document.getElementById('DefineItTextToBold')) {
                        document.getElementById('DefineItTextToBold').removeAttribute('id');
                        // $(rangeNew.commonAncestorContainer).contents().unwrap();
                    };
                    // !-- Above fixed what bottom may be able to but better, not sure yet
                    // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);
                    // !-- document.execCommand("bold", false, null)
                    $(bold).contents().unwrap();
                    var coor = "X coords: " + x + ", Y coords: " + y;
                    if ( ( x < (iconPopupPositions.x) || x > iconPopupLeftToRight ) || y < (iconPopupPositions.y) || y > iconPopupTopToBottom ) {
                        console.log('SHOULD BE OUTSIDE Icon');
                        // range.startContainer.childNodes[rangeNode].remove();
                        $(span).contents().unwrap();
                        window.removeEventListener('mouseenter', iconPopup);
                        window.removeEventListener('mouseleave', iconPopup);
                        document.getElementById('defineIt-iconNode').remove();
                        iconPopupExists = false;
                        window.removeEventListener('mousedown', showPopup, false);
                        let iconPopupPosition = iconPopup.getBoundingClientRect();
                        iconPopup.style.left = (boldPosition.left - iconPopupPosition.left + 'px') + iconPopup.style.width;
                    } else {
                        window.removeEventListener('mouseenter', iconPopup);
                        window.removeEventListener('mouseleave', iconPopup);
                        window.removeEventListener('mousedown', showPopup, false);
                        document.getElementById('defineIt-iconNode').remove();
                        iconPopupExists = false;
                        doPositioning(containerNode);
                    }
                }
            }
        } else {
            contextMenuExists = false;
        }
    };
    // Observe one or multiple elements
    let iconPopupPositionStart = iconPopup.getBoundingClientRect();
    let iconPopupLeftToRightStart = iconPopupPositionStart.x + iconPopupPositionStart.width;
    let iconPopupTopToBottomStart = iconPopupPositionStart.y + iconPopupPositionStart.height;
    iconPopup.style.left = (boldPosition.left) + span.offsetWidth + 'px';
    // let overlapHeight = boldPosition.top - documentHeight + parseInt(iconPopup.style.height);
    if ( (boldPosition.top - documentHeight + parseInt(iconPopup.style.height)) > -18) {
        // Trigger from top
        iconPopup.style.top = boldPosition.top - parseInt(iconPopup.style.height) + 15 - 50 - span.offsetHeight + 'px';
    } else {
        iconPopup.style.top = boldPosition.top + 'px';
    }
    overlapWidth = documentWidth - iconPopup.getBoundingClientRect().x;
    let rangeNode = rangeWindow.startOffset;
    if ( overlapWidth < parseInt(iconPopup.style.width)+26 ) {
        if (document.getElementById('defineIt-iconNode')) {
            iconPopup.style.left = parseInt(iconPopup.style.left) - (parseInt(iconPopup.style.width)+26 - overlapWidth) + 'px';
        }
    }
    window.addEventListener('mousedown', showPopup, false);
}

function doPositioning(popupNode) {
    if (document.getElementById('defineIt-iconNode')) {
        document.getElementById('defineIt-iconNode').remove();
    }
    var body = document.body,
    html = document.documentElement;

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight 
        );
    var documentWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
         );
    popupNode.id = 'defineIt-popupNode';
    popupNode.className = 'selectedWord';
    // !-- Old way that gets cropped --!
    // range.insertNode(popupNode);
    document.getElementsByTagName('body')[0].insertBefore(popupNode, document.getElementsByTagName('body')[0].firstChild);
    // !-- Scratch the resizer for now
/*     var ro = new ResizeObserver( entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            console.log('Element:', entry.target);
            console.log(`Element size: ${cr.width}px x ${cr.height}px`);
            console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
            if (cr.width !== 0 || cr.height !== 0) {
            popupDimensionsResize = cr;
            }
        }
        // chrome.runtime.sendMessage({text: 'resizePopup', dimensions: { width: popupDimensionsResize.width, height: popupDimensionsResize.height }});
        chrome.storage.local.set({popupDimensions: { width: popupDimensionsResize.width, height: popupDimensionsResize.height}}, function() {
            console.log('Value is set to ' + JSON.stringify(popupDimensionsResize));
        });
        return entries;
    }); */
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
                        // $(rangeNew.commonAncestorContainer).contents().unwrap();
                    };
                    // !-- Above fixed what bottom may be able to but better, not sure yet
                    // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);
                    // !-- document.execCommand("bold", false, null)
                    $(bold).contents().unwrap();
                    var coor = "X coords: " + x + ", Y coords: " + y;
                    if ( ( x < (popupNodePositions.x) || x > popupNodeLeftToRight ) || y < (popupNodePositions.y) || y > popupNodeTopToBottom ) {
                        console.log('SHOULD BE OUTSIDE Popup');
                        // range.startContainer.childNodes[rangeNode].remove();
                        $(span).contents().unwrap();
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
    // Observe one or multiple elements
    // !-- Scratch the resizer for now
    // ro.observe(popupNode);
    let popupNodePositionStart = popupNode.getBoundingClientRect();
    let popupNodeLeftToRightStart = popupNodePositionStart.x + popupNodePositionStart.width;
    let popupNodeTopToBottomStart = popupNodePositionStart.y + popupNodePositionStart.height;
    popupNode.style.left = (boldPosition.left) + span.offsetWidth + 'px';
    // let overlapHeight = boldPosition.top - documentHeight + parseInt(popupNode.style.height);
    if ( (boldPosition.top - documentHeight + parseInt(popupNode.style.height)) > -18) {
        // Trigger from top
        popupNode.style.top = boldPosition.top - parseInt(popupNode.style.height) + 15 - 50 - span.offsetHeight + 'px';
    } else {
        popupNode.style.top = boldPosition.top + 'px';
    }
    overlapWidth = documentWidth - popupNode.getBoundingClientRect().x;
    let rangeNode = rangeWindow.startOffset;
    if ( overlapWidth < parseInt(popupNode.style.width)+26 ) {
        if (document.getElementById('defineIt-popupNode')) {
            popupNode.style.left = parseInt(popupNode.style.left) - (parseInt(popupNode.style.width)+26 - overlapWidth) + 'px';
        }
    }
    window.addEventListener('mousedown', showPopup, false);
}


function executeExtension() {
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
        // !-- CHECK INTO WHY ZANDO GOLF GOES LEFT, ALSO WHY EVERYTHING GOES LEFT ON SINGLE CLICK AND AWAY ON SECOND
        // !-- Definitely redo array index of check blacklist above with reg exp.
        // !-- Add language
        // in this case, play. Maybe find a way to search for the word 'Play' by searching for indexOf('Play') and the nodeName has to be an <h1> or something,
        // do getBoundingClientRect() on it and scroll the popup down there, I'm pretty sure it's easy to do.
    
        if (e.which === 1) {
            var text = "";
            if (window.getSelection && window.getSelection().toString().trim().length > 0) {
                // !-- IMPORTANT, STOP DESELECTION SO USERS CAN'T COPY WHEN HIGHLIGHTED
        
                // Rework to use x and y rather than document I think... 
                text = window.getSelection().toString().trim();
                let selectedDOM = window.getSelection().focusNode;
                // !-- This below method may be inconsistent if there are more versions of the dom element surrounding the selection, this method searches the entire body for the text, and assumes it appears only once.
                // Use below as reference, with the emphasis on range as it allows dom insertion at the specific select.
                let highlight = window.getSelection();
                bold = document.createElement('b');
                rangeWindow = highlight.getRangeAt(0);
                bold.id = 'DefineItTextToBold';
                bold.style.fontWeight = 'unset';
                // bold.getBoundingClientRect();
                
                // Begin popup ---

                popupNode = document.createElement('div');
                popupNode.className = "selectedWord";
                // !-- Scratch the resizer for now
/*                 chrome.storage.local.get(['popupDimensions'], function(result) {
                    console.log(result);
                    parsedStringifiedResult = JSON.parse(JSON.stringify(result));
                    syncedPopupWidth = parsedStringifiedResult.popupDimensions.width;
                    syncedPopupHeight = parsedStringifiedResult.popupDimensions.height;
                    if (syncedPopupWidth !== 0 && syncedPopupHeight !== 0) {
                        popupNode.style.width = syncedPopupWidth + 'px';
                        popupNode.style.height = syncedPopupHeight + 'px';
                    } else {
                        popupNode.style.width = '350px';
                        popupNode.style.height = '500px';
                    }
                }); */
                // !-- Add localStorage capture of resize
    
                // !-- New idea, maybe try a bunch of dictionary websites, either at the same time, first one with a 200 response or something is used, or by order of if 404;
                // !-- Like promises
    /*                         rangeWindow.endContainer.appendChild(rangeWindow.extractContents());
                // range.surroundContents(bold);
                // !-- Gonna have to change this to do bottom way as well maybe
                boldPosition = getCoords(bold); */
                var rangeNew = window.getSelection().getRangeAt(0);
                    span = document.createElement('span');
            
                span.id = 'DefineItTextToBold';
                span.appendChild(rangeNew.extractContents());
                rangeNew.insertNode(span);
                newBoldElement = document.getElementById('DefineItTextToBold');
                boldPosition = getCoords(newBoldElement);
                selectElement(newBoldElement);
                fullAPIURL = 'https://od-api.oxforddictionaries.com/api/v2' + '/lemmas/' + language + '/' + text;
                if (text.indexOf(' ') === -1 && text.length <= 45 && !document.getElementById('defineIt-popupNode')) {
                    chrome.runtime.sendMessage({text: 'API_CALL', url: fullAPIURL, word: text});
                }
                // !-- Decide if we want to make height and width not a constant, atm getting height and width at this stage doesn't work, what we could do is define
                // !-- it with js, that we can access it here, problem is media queries work nicely  
                // Styling
            } else if (document.selection && document.selection.type != "Control" && document.selection.createRange().text.length > 0) {
                text = document.selection.createRange().text;
                let selectedDOM = document.selection.createRange().focusNode;
                // Begin popup ---
                popupNode = document.createElement("div");
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
        //if (isIconActive === false) {
            //getSelectionText(e);
        //}
        if (!document.getElementById('defineIt-popupNode')) {
            getSelectionText(e);
        }
    });
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.text === "API_RESPONSE" && !document.getElementById('defineIt-iconNode')) {
            console.log('HAPPENING AFTER CLICK?');
            let API_resp_data = JSON.parse(request.data).results;
            let id = API_resp_data.id;
            let type = API_resp_data.type;
            lexicalCategoryDiv = document.createElement('div');
            lexicalCategoryDiv.className = 'lexicalCategoryDiv';
            definitionsNode = document.createElement('div');
            definitionsNode.className = 'definitionsNode';
            // language = elt.language
            // Det different lexicalCategories
            for (let elt of API_resp_data) {
                APIword = elt.word;
                wordNode = document.createElement('p');
                wordNode.textContent = APIword;
                wordNode.className = 'wordNode';

                console.log(APIword);
                for (let elts of elt.lexicalEntries) {
                    let definitionsNode = document.createElement('div');
                    definitionsNode.className = 'definitionsNode';
                    let lexicalCategorySubDiv = document.createElement('div');
                    lexicalCategorySubDiv.className = 'lexicalCategorySubDiv';
                    let lexicalCategoryP = document.createElement('p');
                    lexicalCategoryP.className = 'lexicalCategoryP';
                    lexicalCategoryP.textContent = elts.lexicalCategory.id;

                    // Still need to style lexicalCategory

                    lexicalCategorySubDiv.appendChild(lexicalCategoryP);
                    //lexicalCategoryArr.push()
                    // lexicalCategoryArr.push(lexicalCategoryP);
                    for (let eltz of elts.entries[0].senses) {
                        let definition = eltz.definitions[0];
                        let definitionNode = document.createElement('p');
                        definitionNode.textContent = definition;
                        definitionNode.className = 'definitions';
                        definitionsNode.appendChild(definitionNode);
                        definitions.push(definitionNode);
                    }
                    lexicalCategorySubDiv.appendChild(definitionsNode);
                    lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                }
            }
            iconPopupExists = true;
            popupIcon();
        }
    });          
}

chrome.storage.local.get(['blacklistedURLS'], function(res) {

    if (res.blacklistedURLS) {
        // Problem: If the domain is blacklisted but the page isn't, and we check the array for an index of the window location href
        // Array indexes strictly work for exact matches
        // Solution: join the array, thus converting it to a string
        // This should work as all we want to know is if either the domain or the page is blacklisted, then this shouldn't work at all and we don't 
        // care which on this page, just that it shouldn't work
        let joinedBlacklists = res.blacklistedURLS.join(' ');

        if (joinedBlacklists.length === 0) {
            pageIsBlacklisted = false;
            executeExtension()
        } else if (window.location.href.indexOf(joinedBlacklists) === -1) {
            pageIsBlacklisted = false;
            executeExtension();
        }
    } else {
        pageIsBlacklisted = false;
        executeExtension()
    }
});