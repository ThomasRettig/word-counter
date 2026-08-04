/*jshint esversion: 6 */

let textarea = document.getElementById('textarea');
if (localStorage.getItem('textValue')) {
    textarea.value = localStorage.getItem('textValue');
};

// Auto-save indicator
const saveIndicator = document.createElement('span');
saveIndicator.id = 'saveIndicator';
saveIndicator.textContent = '✓ Saved';
saveIndicator.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#4caf50;color:white;padding:8px 16px;border-radius:4px;font-size:14px;opacity:0;transition:opacity 0.3s;z-index:1000;';
document.body.appendChild(saveIndicator);

let saveTimeout;
const showSaveIndicator = () => {
    saveIndicator.style.opacity = '1';
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveIndicator.style.opacity = '0';
    }, 2000);
};

// Font size slider with value display
const fontSlider = document.getElementById('fontSlider');
const fontSizeValue = document.getElementById('fontSizeValue');

const trackText = e => {
    const text = e.target.value;
    const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
    document.getElementById('words').textContent = words.length;
    document.getElementById('chars').textContent = text.replace(/\s/g, '').length;
    document.getElementById('charsWhitespace').textContent = text.length;
    document.title = `Word count: ${words.length}`;
    localStorage.setItem('textValue', text);
    showSaveIndicator();
    calculateReadingTime();
    updateCount();
};

textarea.addEventListener('input', trackText);

// Clear text button with confirmation
const clearBtn = document.createElement('button');
clearBtn.id = 'clearBtn';
clearBtn.innerHTML = '<img src="settings.svg" draggable="false" alt="" aria-hidden="true">Clear text';
clearBtn.style.cssText = 'background:none;border:1px solid #ccc;padding:8px 16px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:14px;margin-top:10px;';
clearBtn.setAttribute('aria-label', 'Clear all text from the editor');

clearBtn.addEventListener('click', () => {
    if (textarea.value.trim() === '') {
        return;
    }
    if (confirm('Are you sure you want to clear all text? This action cannot be undone.')) {
        textarea.value = '';
        localStorage.removeItem('textValue');
        trackText({ target: textarea });
        textarea.focus();
    }
});

document.getElementById('buttons').appendChild(clearBtn);

// from https://codepen.io/balasubramanim/pen/xypRMP

const calculateReadingTime = () => {
    const wordsPerMinute = 240;
    const textLength = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    const result = textLength > 0 ? `${Math.ceil(textLength / wordsPerMinute)} min` : '0 min';
    document.getElementById('readingTime').textContent = result;
};

// toggle monospaced font
document.getElementById('toggleFont').addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('textarea').classList.add('monospace');
    } else {
        document.getElementById('textarea').classList.remove('monospace');
    }
});

// font size slider
fontSlider.addEventListener('input', function() {
    const size = `${this.value}px`;
    document.getElementById('textarea').style.fontSize = size;
    if (fontSizeValue) {
        fontSizeValue.textContent = this.value;
    }
});

// make textarea resize height automatically
const autoResizeTextarea = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
};

textarea.addEventListener('input', autoResizeTextarea);
// Initial resize on page load
autoResizeTextarea();

/**
 * Calculate byte size of a text snippet
 * @author Lea Verou
 * MIT License
 */

(function() {

    var crlf = /(\r?\n|\r)/g,
        whitespace = /(\r?\n|\r|\s+)/g;

    window.ByteSize = {
        count: function(text, options) {
            // Set option defaults
            options = options || {};
            options.lineBreaks = options.lineBreaks || 1;
            options.ignoreWhitespace = options.ignoreWhitespace || false;

            var length = text.length,
                nonAscii = length - text.replace(/[\u0100-\uFFFF]/g, '').length,
                lineBreaks = length - text.replace(crlf, '').length;

            if (options.ignoreWhitespace) {
                // Strip whitespace
                text = text.replace(whitespace, '');

                return text.length + nonAscii;
            } else {
                return length + nonAscii + Math.max(0, options.lineBreaks * (lineBreaks - 1));
            }
        },

        format: function(count, plainText) {
            var level = 0;

            while (count > 1024) {
                count /= 1024;
                level++;
            }

            // Round to 2 decimals
            count = Math.round(count * 100) / 100;

            level = ['', 'K', 'M', 'G', 'T'][level];

            return (plainText ? count : count) + ' ' + level + 'B';
        }
    };

})();

const isWin = navigator.platform.indexOf('Win') === 0;

const updateCount = () => {
    const text = textarea.value;
    const results = document.getElementById('results');
    const sizeUnix = ByteSize.format(ByteSize.count(text));
    const sizeWin = ByteSize.format(ByteSize.count(text, {
        lineBreaks: 2
    }));

    results.textContent = (isWin ? sizeWin : sizeUnix);
};

// Initialize reading time on page load
calculateReadingTime();
updateCount();
