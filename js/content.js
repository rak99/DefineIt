function popupIcon(node) {
    var body = document.body.firstChild,
    html = document.documentElement;

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight 
        );
    var documentWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
         );

    // let spinnerFile = await fetchHTMLResource('../html/spinner.html');
    // let popupNode = await fetchHTMLResource('../html/definitionPopup.html');
    let iconPopup = node.getElementById('defineIt-iconNode');
        // !-- WHERE I STOPPED, ERASE TOMORROW
    /* 

    document.getElementsByTagName('body')[0].insertBefore(iconPopup, document.getElementsByTagName('body')[0].firstChild);
    const showPopup = (e) => {
        console.log('DONT HAPPEN AFTER LOGO CLICK');
        if (e.which === 1) {

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
                        console.log('SHOULD BE OUTSIDE Icon', x, y, iconPopupPositions, iconPopupLeftToRight, iconPopupTopToBottom);
                        // range.startContainer.childNodes[rangeNode].remove();
                        $(span).contents().unwrap();
                        window.removeEventListener('mouseenter', iconPopup);
                        window.removeEventListener('mouseleave', iconPopup);
                        document.getElementById('defineIt-iconNode').remove();
                        window.removeEventListener('mousedown', showPopup, false);
                        let iconPopupPosition = iconPopup.getBoundingClientRect();
                        iconPopup.style.left = (boldPosition.left - iconPopupPosition.left + 'px') + iconPopup.offsetWidth;
                    } else {
                        window.removeEventListener('mouseenter', iconPopup);
                        window.removeEventListener('mouseleave', iconPopup);
                        window.removeEventListener('mousedown', showPopup, false);
                        document.getElementById('defineIt-iconNode').remove();
                        chrome.extension.sendRequest({cmd: "read_file"}, function(html){
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            console.log(doc);
                            popupNode.id = 'defineIt-popupNode';
                            popupNode.className = 'selectedWord';
                        
                            // !-- Old way that gets cropped --!
                            // range.insertNode(popupNode);

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
                                // !-- Change to local file
                                imgNode.src = 'https://i.imgur.com/9JXSmyz.png';
                                headerNode.appendChild(imgNode);
            
                                let flexRightNode = document.createElement('div');
                                flexRightNode.className = 'flexRightNode';
                                headerNode.appendChild(flexRightNode);
                                containerNode.appendChild(headerNode);
                                

                            document.getElementsByTagName('body')[0].insertBefore(popupNode, document.getElementsByTagName('body')[0].firstChild);
                        });
                        getLocal();
                        // API
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
    // let overlapHeight = boldPosition.top - documentHeight + parseInt(iconPopup.offsetHeight);
    if ( (boldPosition.top - documentHeight + parseInt(iconPopup.offsetHeight)) > -18) {
        console.log('rearrange trigger top');
        // Trigger from top
        iconPopup.style.top = boldPosition.top - parseInt(iconPopup.offsetHeight) + 15 - 50 - span.offsetHeight + 'px';
    } else {
        console.log('rearrange dunno bot?');
        iconPopup.style.top = boldPosition.top + 'px';
    }
    overlapWidth = documentWidth - iconPopup.getBoundingClientRect().x;
    let rangeNode = rangeWindow.startOffset;
    console.log(overlapWidth, iconPopup.style.left, iconPopup.offsetWidth, 'rearrange width');
    if ( overlapWidth < parseInt(iconPopup.offsetWidth)+26 ) {
        console.log('rearrange width');
        if (document.getElementById('defineIt-iconNode')) {
            console.log('rearrange width2');
            iconPopup.style.left = parseInt(iconPopup.style.left) - (parseInt(iconPopup.offsetWidth)+26 - overlapWidth) + 'px';
        }
    } */
}

async function getNodesAndStartPopup(node, word) {

    let iconNode = await fetchHTMLResource('../html/iconPopup.html');

    let wordDOMChildrenArr = [...node.childNodes].toString();
    if (node.nodeName !== 'INPUT' && wordDOMChildrenArr.indexOf('HTMLInputElement') === -1) {

        var rangeNew = window.getSelection().getRangeAt(0);
        span = document.createElement('span');

        span.id = 'DefineItTextToBold';
        span.appendChild(rangeNew.extractContents());
        rangeNew.insertNode(span);
        newBoldElement = document.getElementById('DefineItTextToBold');
        boldPosition = getCoords(newBoldElement);
        selectElement(newBoldElement);
        popupIcon(iconNode);
        
    }

}

function checkIfWord(words, word) {

    let wordsArrToJoinedString = words.join(' ');

    if (wordsArrToJoinedString.indexOf(word.toLowerCase()) !== -1) {

        //Get focusNode and send it to
        let node = window.getSelection().focusNode;
        if (node)
            getNodesAndStartPopup(node, word);

    } // else 

}

function fetchWordResource(file, word) {

    // Fetch web resource, also added to manifest.json
    let fileType = file.split('.').pop();
    const url = chrome.runtime.getURL(file);

    fetch(url)
        .then((response) => fileType === 'json' ? response.json() : response.text()) //assuming file contains json
        .then((json) => checkIfWord(json, word));
        
}

async function fetchHTMLResource(file) {

    // Fetch web resource, also added to manifest.json
    const url = chrome.runtime.getURL(file);

    return fetch(url, {
        headers: {
            dataType: 'html',
            'Content-Type': 'text/html'
        }
    })
    .then((response) => response.text())
    .then((html) => {
        console.log(html);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    });
        
}

function checkWordsInMouseUp(e) {

    // Check if word contained in mouseUp, if true then call fetchResource
    if (e.which === 1) {

        console.log('left click');
        let trimmedSelection = window.getSelection().toString().trim();
        if (trimmedSelection)
            fetchWordResource('../wordsarray.json', trimmedSelection)

    }   

}

async function checkIfBlacklisted(blacklists) {

    // Problem: If the domain is blacklisted but the page isn't, and we check the array for an index of the window location href
    // Array indexes strictly work for exact matches
    // Solution: join the array, thus converting it to a string
    // This should work as all we want to know is if either the domain or the page is blacklisted, then this shouldn't work at all and we don't 
    // care which on this page, just that it shouldn't work
    if (blacklists.blacklistedURLS) {

        let blacklistsArray = blacklists.blacklistedURLS;
        let joinedBlacklists = blacklistsArray.join(' ');
        if (joinedBlacklists.length === 0) {
            return false;
        } else if (window.location.href.indexOf(joinedBlacklists) === -1) {
            return false;
        } else if (window.location.href.indexOf(joinedBlacklists) > -1)
            return true;
        
    } else {
        return false;
    }

}

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

// Check blacklistedURLS for current URL, if blacklisted return, else add eventListener
chrome.storage.local.get(['blacklistedURLS'], async function(res) {

        let isBlacklisted = await checkIfBlacklisted(res);
        console.log(isBlacklisted);
        if (isBlacklisted === false)
            window.addEventListener('mouseup', checkWordsInMouseUp, false);

        // pageIsBlacklisted = false;
        // Add mouse event listeners
            
});