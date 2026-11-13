/*

if you encounter any issues or have feature recommendations,

write an issue & feature on : https://github.com/cagan-elden/markdjs
or send me a mail on        : caganeldenk@gmail.com

this package is owned by : https://github.com/cagan-elden

*/

// this function sanitizes url's, I only allowed http, https & mailto for now
const sanitizeUrl = (url) => {
    const trimmedUrl = url.trim();

    if (/^(https?:\/\/|mailto:)/i.test(trimmedUrl)) {
        return trimmedUrl;
    }
    return '#';
}

// regex for html-md rendering
const inlineRegexParser = (line) => {
    return (line
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, str, url) => {
            return `<a href="${ sanitizeUrl(url) }">${str}</a>`
        })
    );
};

// escapes html tags to avoid malicious script & html tags
const escapeHTML = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
};

// I've added this so adding new tags is going to be much more easier, this is where the tags such as <h1>, <h2> etc. would go
// It is important to define rows of the map as a function, otherwise things would to break
const defaultTags = [
    {
        tag: (line) => line.startsWith('# '),
        parse: (line) => `<h1>${ inlineRegexParser(line.slice(2)) }</h1>`
    },

    {
        tag: (line) => line.startsWith('## '),
        parse: (line) => `<h2>${ inlineRegexParser(line.slice(3)) }</h2>`
    },

    {
        tag: (line) => line.startsWith('### '),
        parse: (line) => `<h3>${ inlineRegexParser(line.slice(4)) }</h3>`
    },

    {
        tag: (line) => line.startsWith('---'),
        parse: () => '<div class="md-line"></div>'
    }
];

// this function clears the ugly markdown tags for widgets by outputting <strong> & <em>
// I recommend using this for displaying widgets
export const clearTags = (mdString) => {
    const withoutHtmlString = escapeHTML(mdString);

    return (withoutHtmlString
        .replace(/^#+\s?/gm, '')
        .replace(/`([^`]+)`/g, '<strong>$1</strong>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, `<strong>$1</strong>`)
        .replace(/^---$/gm, '')
        );
}

// this is the function which does the job
const rendMD = (mdString) => {
    const lineArr = escapeHTML(mdString).split(/\r?\n/);
    const renderedArr = [];

    let listChecker = false;
    let inOrderedList = false;

    for (let i=0; i < lineArr.length; i++) {
        const line = lineArr[i];
        const lineNoSpaces = line.trim();

        // check for list tags
        let isUnorderedList = (lineNoSpaces.startsWith('- ') || lineNoSpaces.startsWith('+ ') || lineNoSpaces.startsWith('* '));
        let isOrderedList   = /^\d+\.\s/.test(lineNoSpaces);

        // I'm gonna make these much more readable & easier to add new tags in newer versions
        if (isOrderedList) {

            if (!inOrderedList) { renderedArr.push('<ol>'); inOrderedList=true; }
            renderedArr.push(`<li>${inlineRegexParser(lineNoSpaces.slice(lineNoSpaces.indexOf('.')+1))}</li>`);

        } else if (isUnorderedList) {

            if (inOrderedList) { renderedArr.push('</ol>'); }
            if (!listChecker) { renderedArr.push('<ul>'); listChecker = true; }
            renderedArr.push(`<li>${ inlineRegexParser(lineNoSpaces.slice(2)) }</li>`);

        } else {

            if (inOrderedList) { renderedArr.push('</ol>'); }
            if (listChecker) { renderedArr.push('</ul>'); listChecker = false; }

            // tag-checking made easier to add new tags much easier
            const checkForTags = defaultTags.find(rule => rule.tag(lineNoSpaces));

            if (checkForTags) { renderedArr.push(checkForTags.parse(lineNoSpaces)); }
            else { renderedArr.push(`<p>${ inlineRegexParser(lineNoSpaces) }</p>`) }

        }
    }

    if (listChecker) { renderedArr.push('</ul>'); }

    return renderedArr.join('');
}

export default rendMD;