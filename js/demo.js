const urlParams = new URLSearchParams(window.location.search);
const url = new URL(urlParams.get('url') || 'https://en.wikipedia.org/wiki/COVID_19');
const query = urlParams.get('query') || url.href === 'https://en.wikipedia.org/wiki/COVID_19'
                                      ? 'How is it transmitted?' : '';
const result = urlParams.get('result') || '';
const cannotLoadHTML =
    `<style>
        #cannotLoad {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font: 25px sans-serif;
        }

        #cannotLoad > span {
            cursor: pointer;
            text-decoration: underline;
        }
    </style>
    <div id='cannotLoad'>Cannot load unknown page in demo.
        <span onclick='window.top.location.reload()'>Go back?</span>
    </div>`;

loadFrame();

function loadFrame(srcUrl = url) {
    fetch(`http://0.0.0.0:5069/v3/get_page/${srcUrl.href}`)
        .then(response => response.text())
        .then(html => html.replace(/(<head[^>]*>)/, `$1<base href="${srcUrl.href}"/>`))
        .then(html => {
            $('#iframe').remove();
            $('<iframe>', {
                srcdoc: html,
                id: 'iframe',
                frameborder: 0
            }).appendTo('body');
            $('#iframe').one('load', () => loadSubframes().then(loadPopup));
        })
        .catch(console.error);
}

function loadSubframes(parentSelector = '#iframe') {
    return Promise.allSettled(
        $(parentSelector).contents().find('iframe').map(function() {
            let frame = this;
            const srcUrl = frame.src;
            if (!srcUrl) return new Promise((resolve, reject) => {
                loadSubframes(frame).then(resolve).catch(reject);
            });
            frame.removeAttribute('src');
            return new Promise((resolve, reject) => {
                fetch(`http://0.0.0.0:5069/v3/get_page/${srcUrl}`)
                    .then(response => response.text())
                    .then(html => html.replace(/(<head[^>]*>)/, `$1<base href="${srcUrl}"/>`))
                    .then(html => {
                        frame.setAttribute('srcdoc', html);
                        $(frame).one('load', () => loadSubframes(frame).then(resolve));
                    })
                    .catch(reject);
            });
        })
    );
}

let search = true;
function loadPopup() {
    $('#iframe').one('load', function() {
        $('#iframe').attr({src: '', srcdoc: cannotLoadHTML});
    });
    $('#iframe').contents().find('a').on('click', function() {
        $('#iframe').off('load');
        resetPopup();
        loadFrame({href: this.href});
    });
    chrome.browserAction.activate(search);
    if (search) { // search for query
        search = false; // only search on original page, not redirected pages
        chrome.extension.active.then(() => {
            window.postMessage({type: 'demo', query: query, result: result}, '*');
        });
    } else onLoad(); // just load page
}

function resetPopup() {
    clearInterval(typingInterval);
    clearInterval(loadingInterval);
    clearTimeout(corpusTimeout);
    corpusRequested = corpusPrepared = corpusPosted = false;
    corpusEmbeddings = corpusEmbeddingsCached = {};
    currentQueryRequest = null;
    lastQuery = '';
    questionRecommender.reset();
    chrome.runtime.sendMessage({
        type: 'popupUpdate',
        updateType: 'reset'
    });
    $(shadowDom).find('#x_close').trigger('click');
}
