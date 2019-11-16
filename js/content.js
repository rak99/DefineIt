function callAPI(word, popupNode) {
    let language = 'en';
    let definitions = [];
    console.log('couldn\'t find locally');
    let dictionary_data = [];
    let capturedWordsDataArr = [];
    fullAPIURL = 'https://od-api.oxforddictionaries.com/api/v2' + '/lemmas/' + language + '/' + word;
    // Add below if checks maybe above so less unnecessary api calls
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.text === "API_Timeout") {
            
        }
    }); 
    chrome.runtime.sendMessage({text: 'API_CALL', url: fullAPIURL, word: word});
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.text === "API_RESPONSE") {

            let API_Word = JSON.parse(request.data).results[0].id;
            capturedWordsDataArr.push(API_Word);
            chrome.storage.local.set({dictionary_word_array: capturedWordsDataArr});
            let API_resp_data = JSON.parse(request.data).results;
            dictionary_data.push(API_resp_data);
            chrome.storage.local.set({dictionary_data: dictionary_data});
            let id = API_resp_data.id;
            let type = API_resp_data.type;
            let lexicalCategoryDiv = popupNode.querySelectorAll('#defineIt-lexicalCategoryDiv')[0];
            let definitionsNode = document.createElement('div');
            definitionsNode.className = 'definitionsNode';
            // language = elt.language
            // Det different lexicalCategories
            console.log(popupNode);
            let wordNode = popupNode.querySelectorAll('#defineIt-wordNode')[0];
            console.log(wordNode);
            wordNode.textContent = word;
            for (let elt of API_resp_data) {
                APIword = elt.word;

                for (let elts of elt.lexicalEntries) {
                    let definitionsNode = document.createElement('div');
                    definitionsNode.className = 'definitionsNode';
                    let lexicalCategorySubDiv = document.createElement('div');
                    lexicalCategorySubDiv.className = 'lexicalCategorySubDiv';
                    let lexicalCategoryP = document.createElement('p');
                    lexicalCategoryP.className = 'lexicalCategoryP';
                    lexicalCategoryP.textContent = elts.lexicalCategory.id;

                    lexicalCategorySubDiv.appendChild(lexicalCategoryP);
                    for (let eltz of elts.entries[0].senses) {
                        let definitionSpan = document.createElement('div');
                        definitionSpan.textContent = '-';
                        definitionSpan.className = 'definitionSpan';
                        //let definition = eltz.definitions[0];
                        let definition = document.createElement('span');
                        definition.className = 'definition';
                        let example = document.createElement('span');
                        definition.textContent = eltz.definitions[0];
                        // example.textContent = eltz.examples[0].text;
                        example.className = 'example';
                        let forwardSlashes = document.createElement('span');
                        forwardSlashes.className = 'forwardSlashes';
                        forwardSlashes.textContent = '//';
                        let exampleText = document.createElement('span');
                        if (eltz.examples) {
                            if (eltz.examples.length > 0) {
                                exampleText.textContent = eltz.examples[0].text;
                                exampleText.className = 'exampleText';
                                example.appendChild(forwardSlashes);
                                example.appendChild(exampleText);
                            }
                        }

                        let definitionNode = document.createElement('p');
                        definitionNode.appendChild(definitionSpan);
                        definitionNode.appendChild(definition);
                        definitionNode.className = 'definitions';
                        definitionsNode.appendChild(definitionNode);
                        definitionsNode.appendChild(example);
                        definitions.push(definitionNode);
                    }
                    lexicalCategorySubDiv.appendChild(definitionsNode);
                    lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                }
                // Then middle div container
                // let middleNode = popupNode.getElementById('defineIt-middleNode');
                    popupNode.querySelectorAll('#defineIt-loading')[0].remove();

                let footerNode = document.createElement('div');
                    footerNode.className = 'footerNode';
            }
            
        }
    }); 
}

async function fetchPopupData(word, popupNode) {
    let wordFoundInLocalDictionary = await checkLocalDictionary(word);
    console.log(wordFoundInLocalDictionary);
    // Do data stuff for both

    let dictionary_data = [];

    
    if (wordFoundInLocalDictionary.dictionaryDefinitions !== undefined) {
        // Word found, don't call API 
        
        let dictionaryWord = wordFoundInLocalDictionary.dictionaryWords;
        let lexicalCategoryDiv = popupNode.querySelectorAll('#defineIt-lexicalCategoryDiv')[0];
        let wordIndex = dictionaryWord.dictionary_word_array.indexOf(word);
        dictionary_data = dictionaryWord.dictionary_data;
        let API_resp_data = dictionary_data[wordIndex];
        let id = API_resp_data.id;
        let type = API_resp_data.type;
        let definitionsNode = document.createElement('div');
        definitionsNode.className = 'definitionsNode';
        let wordNode = popupNode.querySelectorAll('#defineIt-wordNode')[0];
        wordNode.textContent = word;
        for (let elt of API_resp_data) {


        for (let elts of elt.lexicalEntries) {
            let definitionsNode = document.createElement('div');
            definitionsNode.className = 'definitionsNode';
            let lexicalCategorySubDiv = document.createElement('div');
            lexicalCategorySubDiv.className = 'lexicalCategorySubDiv';
            let lexicalCategoryP = document.createElement('p');
            lexicalCategoryP.className = 'lexicalCategoryP';
            lexicalCategoryP.textContent = elts.lexicalCategory.id;

            lexicalCategorySubDiv.appendChild(lexicalCategoryP);

            for (let eltz of elts.entries[0].senses) {

                let definitionSpan = document.createElement('div');
                definitionSpan.textContent = '-';
                definitionSpan.className = 'definitionSpan';
                //let definition = eltz.definitions[0];
                let definition = document.createElement('span');
                definition.className = 'definition';
                let example = document.createElement('span');
                definition.textContent = eltz.definitions[0];
                // example.textContent = eltz.examples[0].text;
                example.className = 'example';
                let forwardSlashes = document.createElement('span');
                forwardSlashes.className = 'forwardSlashes';
                forwardSlashes.textContent = '//';
                let exampleText = document.createElement('span');
                if (eltz.examples) {
                    if (eltz.examples.length > 0) {
                        exampleText.textContent = eltz.examples[0].text;
                        exampleText.className = 'exampleText';
                        example.appendChild(forwardSlashes);
                        example.appendChild(exampleText);
                    }
                }

                let definitionNode = document.createElement('p');
                definitionNode.appendChild(definitionSpan);
                definitionNode.appendChild(definition);
                definitionNode.className = 'definitions';
                definitionsNode.appendChild(definitionNode);
                definitionsNode.appendChild(example);
                definitions.push(definitionNode);

            }
            lexicalCategorySubDiv.appendChild(definitionsNode);
            lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
        }
    }

    // Then middle div container
    popupNode.querySelectorAll('#defineIt-loading')[0].remove();
    let footerNode = document.createElement('div');
        footerNode.className = 'footerNode';

    // Then footer container, potentially with an ad
    } else {
        callAPI(word, popupNode);
    }
}

async function checkLocalDictionary(popupNode, word) {
    let dictionaryObject = {};
    chrome.storage.local.get(['dictionary_word_array'], function(res) {
        if (res.dictionary_word_array) {
            let wordFoundInDictionaryArrIndex = res.dictionary_word_array.indexOf(word) !== -1;
            console.log(res, wordFoundInDictionaryArrIndex);
            if (wordFoundInDictionaryArrIndex === true) {
                let wordIndex = res.dictionary_word_array.indexOf(word);
                chrome.storage.local.get(['dictionary_data'], function(res) {
                    if (res.dictionary_data) {
                        dictionaryObject = {
                            dictionaryDefinitions: res.dictionary_data,
                            dictionaryWords: res.dictionary_word_array,
                            wordIndex: wordIndex
                        };
                    }
                });
            }
        }
    });
    return dictionaryObject;
};

function positionElement(el, boldPosition, documentHeight, documentWidth) {

    el.style.left = (boldPosition.left) + span.offsetWidth + 'px';
    if ( (boldPosition.top - documentHeight + parseInt(el.offsetHeight)) > -18) {
        // Trigger from top
        el.style.top = boldPosition.top - parseInt(el.offsetHeight) + 15 - 50 - span.offsetHeight + 'px';
    } else {
        el.style.top = boldPosition.top + 'px';
    }
    overlapWidth = documentWidth - el.getBoundingClientRect().x;
    if ( overlapWidth < parseInt(el.offsetWidth)+26 ) {
        el.style.left = parseInt(el.style.left) - (parseInt(el.offsetWidth)+26 - overlapWidth) + 'px';
    }
    
}

function popupIcon(node, word, boldPosition) {
    // !-- handle errors tomorrow in console, also click doesn't close it, maybe due to errors tho.
    var body = document.body.firstChild,
    html = document.documentElement;

    var documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight 
        );
    var documentWidth = Math.max( body.scrollWidth, body.offsetWidth,
        html.clientWidth, html.scrollWidth, html.offsetWidth
         );

    let iconPopup = node.getElementById('defineIt-iconNode');

    // Observe one or multiple elements
    window.removeEventListener('mouseup', checkWordsInMouseUp, false);
    positionElement(iconPopup, boldPosition, documentHeight, documentWidth);
    document.getElementsByTagName('body')[0].insertBefore(iconPopup, document.getElementsByTagName('body')[0].firstChild);
    const showPopup = async (e) => {
        if (e.which === 1) {

            // !-- Remove if else later if I decide a single click outside popup should close with contextMenu open
            let iconPopupPositions = iconPopup.getBoundingClientRect();
            let iconPopupLeftToRight = iconPopupPositions.x + iconPopupPositions.width;
            let iconPopupTopToBottom = iconPopupPositions.y + iconPopupPositions.height;
            var x = event.clientX;     // Get the horizontal coordinate
            var y = event.clientY;     // Get the vertical coordinate

            document.getElementById('DefineItTextToBold').removeAttribute('id');
            document.getElementById('defineIt-iconNode').remove();
            // !-- Above fixed what bottom may be able to but better, not sure yet
            // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);
            if ( ( x < (iconPopupPositions.x) || x > iconPopupLeftToRight ) || y < (iconPopupPositions.y) || y > iconPopupTopToBottom ) {
                console.log('SHOULD BE OUTSIDE Icon', x, y, iconPopupPositions, iconPopupLeftToRight, iconPopupTopToBottom);
                $(span).contents().unwrap();
                let iconPopupPosition = iconPopup.getBoundingClientRect();
                iconPopup.style.left = (boldPosition.left - iconPopupPosition.left + 'px') + iconPopup.offsetWidth;
                // Popup should be removed, add mouseup listener back
                // Do this on node one as well if clicked outside
                window.addEventListener('mouseup', checkWordsInMouseUp, false);
            } else {
                // Get popupNode and append loading screen to it, then remove it after dictionary is processed
                let popupNode = await fetchHTMLResource('../html/definitionPopup.html');
                let popupNodeBody = popupNode.getElementById('defineIt-popupNode');
                    popupNodeBody.style.left = iconPopup.style.left;
                    popupNodeBody.style.top = iconPopup.style.top;

                let spinnerFile = await fetchHTMLResource('../html/spinner.html');
                let spinnerBody = spinnerFile.getElementById('defineIt-loading');
                // Middle node should maybe be added after loading screen, check to see
                let middleNode = popupNode.getElementById('defineIt-middleNode');
                middleNode.appendChild(spinnerBody);
                document.getElementsByTagName('body')[0].insertBefore(popupNodeBody, document.getElementsByTagName('body')[0].firstChild);
                // Do loading screen
                fetchPopupData(word, popupNodeBody);
            }
        } else {
            //contextMenuExists = false;
        }
        window.removeEventListener('click', showPopup, false);
    };
    window.addEventListener('click', showPopup, false);
}

async function getNodesAndStartPopup(node, word, boldPosition) {

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
        popupIcon(iconNode, word, boldPosition);
        
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