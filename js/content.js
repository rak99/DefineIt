/**
 * Popup content here
 * Make a nice theme, when text is highlighted the popup should show the word with a dropdown, the dropdown then displays all information about the word
 * Top has been disregarded in favour of an embedded dictionary page, atm hosted on Merriam Webster.
 */

// !-- Trim the selection to eliminate spaces, also - stop popup from executing if there are more than 2 words, or if the user wants maybe they can enable a beta mode where mutliple words can be selected and there will be multiple words
// !-- in the popup, all of which can be dropped down

// ! ----- Modes of requests ----- !

// Consider adding hover mode, check wikipedia functionality for idea on implementation

let popupNode = '';
let boldPosition = '';
let overlapWidth = 0;
let contextMenuExists = false;

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

window.oncontextmenu = function () {
    contextMenuExists = true;
}

function getSelectionText(e) {

    // !-- TODO - Add scroll to base feature
    // !-- Some selected words are not in their origin/base form, e.g playing is selected, but the popup website I use, Merriam-Webster, starts at the origin/base word
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
            let highlight = window.getSelection(),
            bold = document.createElement('b'),
            range = highlight.getRangeAt(0);
            if (range.startContainer.nextSibling) {
                if (range.startContainer.nextSibling.toString() !== "[object Text]") {
                    boldPosition = range.startContainer.nextSibling.getBoundingClientRect();
                }
            } else {
                boldPosition = bold.getBoundingClientRect();
            }
    
            // Begin popup ---
            let popupNode = document.createElement('iframe');
            popupNode.src = `https://www.merriam-webster.com/dictionary/${range}`;
            fetch(popupNode.src)
            .then((res) => {
                if (res.status !== 404) {
                    popupNode.className = "selectedWord";
                    // Styling
                    popupNode.id = 'defineIt-popupNode';
                    range.insertNode(popupNode);
                    console.log(popupNode.getBoundingClientRect());
                    overlapWidth = $(document).width() - popupNode.getBoundingClientRect().x;
                    let rangeNode = range.startOffset;
                    if ( overlapWidth < 426 ) {
                            if (document.getElementById('defineIt-popupNode')) {
                                popupNode.style.right = 426 - overlapWidth + 'px';
                            }
                    }
                    const showPopup = (e) => {
                        if (e.which === 1) {
                            // !-- Remove if else later if I decide a single click outside popup should close with contextMenu open
                            if (contextMenuExists === true) {
                                console.log('next click will close');
                                contextMenuExists = false;
                            } else {
                                if ( document.getElementById('defineIt-popupNode') ) {
                                    let popupNodePositions = popupNode.getBoundingClientRect();
                                    let popupNodeLeftToRight = popupNodePositions.x + popupNodePositions.width;
                                    let popupNodeTopToBottom = popupNodePositions.y + popupNodePositions.height;
                                    var x = event.clientX;     // Get the horizontal coordinate
                                    var y = event.clientY;     // Get the vertical coordinate
                                    var coor = "X coords: " + x + ", Y coords: " + y;
                                    if ( ( x < (popupNodePositions.x) || x > popupNodeLeftToRight ) || y < (popupNodePositions.y) || y > popupNodeTopToBottom ) {
                                        // range.startContainer.childNodes[rangeNode].remove();
                                        document.getElementById('defineIt-popupNode').remove();
                                        $(bold).contents().unwrap();
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
                    $(bold).contents().unwrap();
                    // End popup ---
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
window.addEventListener('mouseup', e => {
    stopFunction = false;
    getSelectionText(e);
});