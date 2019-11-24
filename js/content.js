// !-- Add input and textarea functionality, look at these 2 resources for help
 // - https://github.com/Codecademy/textarea-helper
 // - https://github.com/component/textarea-caret-position
async function callAPI(word, popupNode) {
    let dictionaryObject = await checkLocalDictionary(word);
    let language = 'en';
    let definitions = [];
    let dictionary_definitions = [];
    let dictionary_words = [];
    if (dictionaryObject.dictionaryDefinitions) {
        dictionary_definitions = dictionaryObject.dictionaryDefinitions;
        dictionary_words = dictionaryObject.dictionaryWords;
    }
    fullAPIURL = 'https://od-api.oxforddictionaries.com/api/v2' + '/lemmas/' + language + '/' + word;
    // Add below if checks maybe bove so less unnecessary api calls
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.text === "API_Timeout") {
            
        }
    }); 
    chrome.runtime.sendMessage({text: 'API_CALL', url: fullAPIURL, word: word});
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.text === "API_RESPONSE") {

            let API_Word = JSON.parse(request.data).results[0].id;
            dictionary_words.push(API_Word);
            chrome.storage.local.set({dictionary_word_array: dictionary_words});
            let API_resp_data = JSON.parse(request.data).results;
            dictionary_definitions.push(API_resp_data);
            chrome.storage.local.set({dictionary_data: dictionary_definitions});
            let id = API_resp_data.id;
            let type = API_resp_data.type;
            let lexicalCategoryDiv = popupNode.querySelectorAll('#defineIt-lexicalCategoryDiv')[0];
            let definitionsNode = document.createElement('div');
            definitionsNode.className = 'defineIt-definitionsNode';
            // language = elt.language
            // Det different lexicalCategories
            let wordNode = popupNode.querySelectorAll('#defineIt-wordNode')[0];
            wordNode.textContent = word;
            for (let elt of API_resp_data) {
                APIword = elt.word;
                for (let elts of elt.lexicalEntries) {
                    let definitionsNode = document.createElement('div');
                    definitionsNode.className = 'defineIt-definitionsNode';
                    let lexicalCategorySubDiv = document.createElement('div');
                    lexicalCategorySubDiv.className = 'defineIt-lexicalCategorySubDiv';
                    let lexicalCategoryP = document.createElement('p');
                    lexicalCategoryP.className = 'defineIt-lexicalCategoryP';
                    lexicalCategoryP.textContent = elts.lexicalCategory.id;

                    lexicalCategorySubDiv.appendChild(lexicalCategoryP);
                    if (elts.entries) {
                        if (elts.entries[0].senses) {
                            for (let eltz of elts.entries[0].senses) {
                                let definitionSpan = document.createElement('div');
                                definitionSpan.textContent = '-';
                                definitionSpan.className = 'defineIt-definitionSpan';
                                //let definition = eltz.definitions[0];
                                let definition = document.createElement('span');
                                definition.className = 'defineIt-definition';
                                let example = document.createElement('span');

                                example.className = 'defineIt-example';
                                let forwardSlashes = document.createElement('span');
                                forwardSlashes.className = 'defineIt-forwardSlashes';
                                forwardSlashes.textContent = '//';
                                let exampleText = document.createElement('span');
                                // !-- Maybe don't do this as an else but 2 if's
                                if (eltz.definitions) {
                                    definition.textContent = eltz.definitions[0];
                                } else if (eltz.subsenses) {
                                    definition.textContent = eltz.subsenses[0].definitions[0];
                                    if (eltz.subsenses[0].examples) {
                                        // !-- Maybe do a loop for this
                                        exampleText.textContent = eltz.subsenses[0].examples[0].text;
                                        exampleText.className = 'defineIt-exampleText';
                                        example.appendChild(forwardSlashes);
                                        example.appendChild(exampleText);
                                    }
                                }
                                if (eltz.examples) {
                                    if (eltz.examples.length > 0) {
                                        exampleText.textContent = eltz.examples[0].text;
                                        exampleText.className = 'defineIt-exampleText';
                                        example.appendChild(forwardSlashes);
                                        example.appendChild(exampleText);
                                    }
                                }
                                // example.textContent = eltz.examples[0].text;
        
                                let definitionNode = document.createElement('p');
                                definitionNode.appendChild(definitionSpan);
                                definitionNode.appendChild(definition);
                                definitionNode.className = 'defineIt-definitions';
                                definitionsNode.appendChild(definitionNode);
                                definitionsNode.appendChild(example);
                                definitions.push(definitionNode);
                            }
                            lexicalCategorySubDiv.appendChild(definitionsNode);
                            lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                        } else {
                            let errorDefinitionsNode = document.createElement('div');
                                errorDefinitionsNode.className = 'defineIt-definitionsNode';
                                errorDefinitionsNode.textContent = 'Something must\'e gone wrong, we couldn\'t find this word in our dictionary';
    
                            lexicalCategorySubDiv.appendChild(errorDefinitionsNode);
                            lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                        }
                    }
                }
                // Then middle div container
                // let middleNode = popupNode.getElementById('defineIt-middleNode');
                if (popupNode.querySelectorAll('#defineIt-loading')[0]) {
                    popupNode.querySelectorAll('#defineIt-loading')[0].remove();
                }
                
                let footerNode = document.createElement('div');
                    footerNode.className = 'defineIt-footerNode';
            }
            
        }
    }); 
}

function fetchPopupData(word, popupNode) {
    checkLocalDictionary(word)
    .then((res) => {
        if (res !== 'CallAPI') {
        // Do data stuff for both
        let dictionary_data = [];
        let definitions = [];
        
        // Word found, don't call API 
        
        let dictionaryWord = res;
        let lexicalCategoryDiv = popupNode.querySelectorAll('#defineIt-lexicalCategoryDiv')[0];
        let wordIndex = dictionaryWord.dictionaryWords.indexOf(word);
        dictionary_data = dictionaryWord.dictionaryDefinitions;
        let API_resp_data = dictionaryWord.dictionaryDefinitions[wordIndex];
        let id = API_resp_data.id;
        let type = API_resp_data.type;
        let definitionsNode = document.createElement('div');
        definitionsNode.className = 'defineIt-definitionsNode';
        let wordNode = popupNode.querySelectorAll('#defineIt-wordNode')[0];
        wordNode.textContent = word;
        for (let elt of API_resp_data) {
            APIword = elt.word;
            for (let elts of elt.lexicalEntries) {
                let definitionsNode = document.createElement('div');
                definitionsNode.className = 'defineIt-definitionsNode';
                let lexicalCategorySubDiv = document.createElement('div');
                lexicalCategorySubDiv.className = 'defineIt-lexicalCategorySubDiv';
                let lexicalCategoryP = document.createElement('p');
                lexicalCategoryP.className = 'defineIt-lexicalCategoryP';
                lexicalCategoryP.textContent = elts.lexicalCategory.id;

                lexicalCategorySubDiv.appendChild(lexicalCategoryP);
                if (elts.entries) {
                    if (elts.entries[0].senses) {
                        for (let eltz of elts.entries[0].senses) {
                            let definitionSpan = document.createElement('div');
                            definitionSpan.textContent = '-';
                            definitionSpan.className = 'defineIt-definitionSpan';
                            //let definition = eltz.definitions[0];
                            let definition = document.createElement('span');
                            definition.className = 'defineIt-definition';
                            let example = document.createElement('span');

                            example.className = 'defineIt-example';
                            let forwardSlashes = document.createElement('span');
                            forwardSlashes.className = 'defineIt-forwardSlashes';
                            forwardSlashes.textContent = '//';
                            let exampleText = document.createElement('span');
                            // !-- Maybe don't do this as an else but 2 if's
                            if (eltz.definitions) {
                                definition.textContent = eltz.definitions[0];
                            } else if (eltz.subsenses) {
                                definition.textContent = eltz.subsenses[0].definitions[0];
                                if (eltz.subsenses[0].examples) {
                                    // !-- Maybe do a loop for this
                                    exampleText.textContent = eltz.subsenses[0].examples[0].text;
                                    exampleText.className = 'defineIt-exampleText';
                                    example.appendChild(forwardSlashes);
                                    example.appendChild(exampleText);
                                }
                            }
                            if (eltz.examples) {
                                if (eltz.examples.length > 0) {
                                    exampleText.textContent = eltz.examples[0].text;
                                    exampleText.className = 'defineIt-exampleText';
                                    example.appendChild(forwardSlashes);
                                    example.appendChild(exampleText);
                                }
                            }
                            // example.textContent = eltz.examples[0].text;
    
                            let definitionNode = document.createElement('p');
                            definitionNode.appendChild(definitionSpan);
                            definitionNode.appendChild(definition);
                            definitionNode.className = 'defineIt-definitions';
                            definitionsNode.appendChild(definitionNode);
                            definitionsNode.appendChild(example);
                            definitions.push(definitionNode);
                        }
                        lexicalCategorySubDiv.appendChild(definitionsNode);
                        lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                    } else {
                        let errorDefinitionsNode = document.createElement('div');
                            errorDefinitionsNode.className = 'defineIt-definitionsNode';
                            errorDefinitionsNode.textContent = 'Something must\'e gone wrong, we couldn\'t find this word in our dictionary';

                        lexicalCategorySubDiv.appendChild(errorDefinitionsNode);
                        lexicalCategoryDiv.appendChild(lexicalCategorySubDiv);
                    }
                }
            }
            // Then middle div container
            // let middleNode = popupNode.getElementById('defineIt-middleNode');
            if (popupNode.querySelectorAll('#defineIt-loading')[0]) {
                popupNode.querySelectorAll('#defineIt-loading')[0].remove();
            }
            
            let footerNode = document.createElement('div');
                footerNode.className = 'defineIt-footerNode';
        }

        // Then middle div container
        if (popupNode.querySelectorAll('#defineIt-loading')[0]) {
            popupNode.querySelectorAll('#defineIt-loading')[0].remove();
        }
        let footerNode = document.createElement('div');
            footerNode.className = 'defineIt-footerNode';
        } else {
            callAPI(word, popupNode);
        }
        // Then footer container, potentially with an ad
    });
}

async function checkLocalDictionary(word) {
    return new Promise(function (resolve, reject) {
        let dictionaryObject = {};
        chrome.storage.local.get(['dictionary_word_array'], function(res) {
            if (res.dictionary_word_array) {
                let dictionaryWords = res.dictionary_word_array;
                let wordFoundInDictionaryArrIndex = dictionaryWords.indexOf(word) !== -1;
                if (wordFoundInDictionaryArrIndex === true) {
                    let wordIndex = dictionaryWords.indexOf(word);
                    chrome.storage.local.get(['dictionary_data'], function(res) {
                        if (res.dictionary_data) {
                            dictionaryObject = {
                                dictionaryDefinitions: res.dictionary_data,
                                dictionaryWords: dictionaryWords,
                                wordIndex: wordIndex
                            };
                            resolve(dictionaryObject);
                        }
                    });
                } else {
                    resolve('CallAPI');
                }
            } else {
                resolve('CallAPI');
            }
        });
    });
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
    let textToBoldNode = document.getElementById('DefineItTextToBold');

    // Observe one or multiple elements
    window.removeEventListener('mouseup', checkWordsInMouseUp, false);
    positionElement(iconPopup, boldPosition, documentHeight, documentWidth);
    //let arrowUp = document.createElement('div');
    //arrowUp.className = 'defineIt-arrow-up';
    //positionElement(arrowUp, boldPosition, documentHeight, documentWidth);
    document.getElementsByTagName('body')[0].insertBefore(iconPopup, document.getElementsByTagName('body')[0].firstChild);
    //document.getElementsByTagName('body')[0].insertBefore(arrowUp, document.getElementsByTagName('body')[0].firstChild);
    var ro = new ResizeObserver( entries => {
        for (let entry of entries) {
            const cr = entry.contentRect;
            if (cr.width !== 0 || cr.height !== 0) {
                let boldPositionLeft = getCoords(textToBoldNode).left;
                let boldPositionTop = getCoords(textToBoldNode).top;
                iconPopup.style.left = boldPositionLeft + iconPopup.offsetWidth - 5 + 'px';
                iconPopup.style.top = boldPositionTop + 'px';
            }
        }
    });
    
    ro.observe(document.body);

/*     const resizingWindow = async (e) => {

        document.removeEventListener('resize', resizingWindow, false);
    }

    document.addEventListener('resize', resizingWindow, false); */
    const showPopup = async (e) => {
        if (e.which === 1) {
            // !-- Remove if else later if I decide a single click outside popup should close with contextMenu open
            let iconPopupPositions = iconPopup.getBoundingClientRect();
            let iconPopupLeftToRight = iconPopupPositions.x + iconPopupPositions.width;
            let iconPopupTopToBottom = iconPopupPositions.y + iconPopupPositions.height;

            let x = e.clientX     // Get the horizontal coordinate
            let y = e.clientY;     // Get the vertical coordinate

            document.getElementById('defineIt-iconNode').remove();            

            // !-- Above fixed what bottom may be able to but better, not sure yet
            // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);

            if ( ( x < (iconPopupPositions.x) || x > iconPopupLeftToRight ) || y < (iconPopupPositions.y) || y > iconPopupTopToBottom ) {
                // Disconnect observer
                ro.disconnect(ro);
                // Remove id, reset from start basically
                document.getElementById('DefineItTextToBold').removeAttribute('id');
                window.removeEventListener('click', showPopup, false);
                iconPopup.style.left = (boldPosition.left - iconPopupPositions.left + 'px') + iconPopup.offsetWidth;
                // Popup should be removed, add mouseup listener back
                // Do this on node one as well if clicked outside
                window.addEventListener('mouseup', checkWordsInMouseUp, false);

            } else {
                ro.disconnect(ro);
                window.removeEventListener('click', showPopup, false);
                window.addEventListener('click', showPopupDefinition, false);

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

                popupNode = document.getElementById('defineIt-popupNode');
                // Add resizeobserver for popupNode too
                ro = new ResizeObserver( entries => {
                    for (let entry of entries) {
                        const cr = entry.contentRect;
                        if (cr.width !== 0 || cr.height !== 0) {
                            let boldPositionLeft = getCoords(textToBoldNode).left;
                            let boldPositionTop = getCoords(textToBoldNode).top;
                            popupNode.style.left = boldPositionLeft + 28 + 'px';
                            popupNode.style.top = boldPositionTop + 'px';
                        }
                    }
                });
                
                ro.observe(document.body);

                // Do loading screen
                fetchPopupData(word, popupNodeBody);
            }
        } else {
            //contextMenuExists = false;
        }
    };

    const showPopupDefinition = async (e) => {
        if (e.which === 1) {
            let popupNode = document.getElementById('defineIt-popupNode');
            let popupNodePositions = popupNode.getBoundingClientRect();
            let popupNodeLeftToRight = popupNodePositions.x + popupNodePositions.width;
            let popupNodeTopToBottom = popupNodePositions.y + popupNodePositions.height;
            let x = e.clientX; // Get the horizontal coordinate
            let y = e.clientY; // Get the vertical coordinate

            // !-- Above fixed what bottom may be able to but better, not sure yet
            // !-- document.getElementById('DefineItTextToBold').setAttribute('contenteditable',true);
            if ( ( x < (popupNodePositions.x) || x > popupNodeLeftToRight ) || y < (popupNodePositions.y) || y > popupNodeTopToBottom ) {
                // Disconnect observer
                ro.disconnect(ro);
                // Remove id, reset from start basically
                document.getElementById('DefineItTextToBold').removeAttribute('id');
                document.getElementById('defineIt-popupNode').remove();
                window.removeEventListener('click', showPopupDefinition, false);
                popupNode.style.left = (boldPosition.left - popupNodePositions.left + 'px') + popupNode.offsetWidth;
                // Popup should be removed, add mouseup listener back
                // Do this on node one as well if clicked outside
                window.addEventListener('mouseup', checkWordsInMouseUp, false);
            }
        } else {
            //contextMenuExists = false;
        }
    };
    window.addEventListener('click', showPopup, false);
}

async function getNodesAndStartPopup(node, word, boldPosition) {

    let iconNode = await fetchHTMLResource('../html/iconPopup.html');

    let wordDOMChildrenArr = [...node.childNodes].toString();
    if (node.nodeName !== 'INPUT' && wordDOMChildrenArr.indexOf('HTMLInputElement') === -1 && node.nodeName !== 'TEXTAREA' && wordDOMChildrenArr.indexOf('HTMLTextAreaElement') === -1) {

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
        .then((json) => checkIfWord(json, word.toLowerCase()));
        
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
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc;
    });
        
}

function checkWordsInMouseUp(e) {

    // Check if word contained in mouseUp, if true then call fetchResource
    if (e.which === 1) {
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
        if (isBlacklisted === false)
            window.addEventListener('mouseup', checkWordsInMouseUp, false);

        // pageIsBlacklisted = false;
        // Add mouse event listeners
            
});