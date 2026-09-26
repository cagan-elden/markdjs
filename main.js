// This function uses regex to render html elements by markdown
const inlineRegexParser = (line) => {
    return (line
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
    );
};

// I've written this function for XSS protection
const escapeHTML = (str) => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

// this is the function which does the job
const rendMD = (mdString) => {
    const lineArr = escapeHTML(mdString).split(/\r?\n/);
    const renderedArr = [];

    let listChecker = false;

    for (let i=0; i < lineArr.length; i++) {
        const line = lineArr[i];
        const lineNoSpaces = line.trim();

        // check for list tags
        if (lineNoSpaces.startsWith('- ')) {
            if (!listChecker) { renderedArr.push('<ul>'); listChecker = true; }
            renderedArr.push(`<li>${ inlineRegexParser(line.slice(2)) }</li>`);
        } else {
            if (listChecker) { renderedArr.push('</ul>'); listChecker = false; }
        }

        // check for heading tags
        if (lineNoSpaces.startsWith('# ')) { renderedArr.push(`<h1>${ inlineRegexParser(lineNoSpaces.slice(2)) }</h1>`); }
        else if (lineNoSpaces.startsWith('## ')) { renderedArr.push(`<h2>${ inlineRegexParser(lineNoSpaces.slice(3)) }</h2>`); }
        else if (lineNoSpaces.startsWith('### ')) { renderedArr.push(`<h3>${ inlineRegexParser(lineNoSpaces.slice(4)) }</h3>`); }

        // create your own css for horizontal lines with this class
        else if (lineNoSpaces.startsWith('---')) { renderedArr.push('<div class="md-line"></div>') }

        else { renderedArr.push(`<p>${ inlineRegexParser(lineNoSpaces) }</p>`) }
    }

    if (listChecker) { renderedArr.push('</ul>'); }

    return renderedArr.join('');
}

export default rendMD;