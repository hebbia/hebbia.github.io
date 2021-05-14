chrome = Object.assign(chrome || {}, (function() {

    let _backgroundListeners = [];
    let _contentListeners = [];

    let runtime = Object.assign(chrome.runtime || {}, (function() {

        let getManifest = function() {
            return {
                content_scripts: [
                    {js: [
                        "background.js",
                        'JS_Dependencies/jquery.js',
                        "JS_Dependencies/wink-pos-tagger.js",
                        "JS_Dependencies/sentence_splitter.js",
                        "JS_Dependencies/mark.js",
                        "JS_Dependencies/autocomplete.js",
                        "JS_Helpers/question_generator.js",
                        "JS_Helpers/circular_queue.js",
                        "JS_Helpers/sentence_embedder.js",
                        "JS_Helpers/sentence_cache.js",
                        "JS_Helpers/sentence_matcher.js",
                        "JS_Helpers/query_enrichment.js",
                        "JS_Helpers/post_corpus.js",
                        "JS_Helpers/post_query.js",
                        "JS_Helpers/dropdown.js",
                        "JS_Helpers/math.js",
                        "JS_Helpers/utils.js",
                        "JS_Helpers/popup.js",
                        "JS_Helpers/popup_loader.js",
                        "content.js"
                    ], css: ["CSS/content.css"]}
                ]
            };
        };

        let getURL = function(path) {
            return SERVER_URL + 'Hebbia_Full_Stack/command_h/' + path;
        };

        let sendMessage = function(message, callback) {
            let sender = {
                url: window.location.href,
                tab: {id: null}
            };
            _backgroundListeners.forEach(listener => {
                listener(message, sender, callback);
            });
        };

        let onMessage = (function() {

            let addListener = function(listener) {
                _contentListeners.push(listener);
            };

            let addBgListener = function(listener) {
                _backgroundListeners.push(listener);
            };

            return {
                addListener,
                addBgListener
            };

        })();

        let connect = function() {

            let onDisconnect = (function() {

                let addListener = function() {};

                return {
                    addListener
                };

            })();

            return {
                onDisconnect
            };

        };

        let onConnect = (function() {

            let addListener = function() {};

            return {
                addListener
            };

        })();

        let getPackageDirectoryEntry = function(callback) {

            let root = (function() {

                let getFile = function(fileName, config, success, failure) {
                    
                    let file = (function() {

                        let file = function() {};
        
                        return {
                            file
                        };
        
                    })();

                    success(file);

                };

                return {
                    getFile
                };

            })();

            callback(root);

        };

        let openOptionsPage = function() {};

        let onInstalled = (function() {

            let addListener = function(callback) {
                callback({reason: 'install'});
            };

            return {
                addListener
            };

        })();

        return {
            getManifest,
            getURL,
            sendMessage,
            onMessage,
            connect,
            onConnect,
            getPackageDirectoryEntry,
            openOptionsPage,
            onInstalled
        };

    })());

    let tabs = Object.assign(chrome.tabs || {}, (function() {

        let sendMessage = function(tabId, message, callback) {
            let sender = {
                url: window.location.href,
                tab: {id: null}
            };
            _contentListeners.forEach(listener => {
                listener(message, sender, callback);
            });
        };

        let onActivated = (function() {

            let addListener = function(listener) {
                document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'visible')
                        listener({tabId: null});
                })
            };

            return {
                addListener
            };

        })();

        let query = function(config, callback) {
            callback([{url: window.location.href}]);
        };

        let create = update = function() {};

        return {
            sendMessage,
            onActivated,
            query,
            create,
            update
        };

    })());

    let storage = Object.assign(chrome.storage || {}, (function() {

        let sync = (function() {

            let _storage = {};

            let set = function(data, callback) {
                Object.assign(_storage, data);
                callback();
            };

            let get = function(keys, callback) {
                callback([keys].flat().reduce((data, key) => {
                    data[key] = _storage[key];
                    return data;
                }, {}));
            };

            return {
                set,
                get
            };

        })();

        return {
            sync
        };

    })());

    let webNavigation = Object.assign(chrome.webNavigation || {}, (function() {

        let onCreatedNavigationTarget
            = onCompleted
            = onBeforeNavigate
            = (function() {

            let addListener = function() {};

            return {
                addListener
            };

        })();

        return {
            onCreatedNavigationTarget,
            onCompleted,
            onBeforeNavigate
        };

    })());

    let browserAction = Object.assign(chrome.browserAction || {}, (function() {

        let _activateClickHandler = function() {};

        let onClicked = (function() {

            let addListener = function(callback) {

                _activateClickHandler = function(applyToPopup = true) {
                    let applyToFrames = function(frame) {
                        
                        frame.addEventListener('keydown', function(e) {
                            if (e.key === 'h' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                callback({id: null});
                            }
                        });
    
                        for (let i = 0; i < frame.frames.length; ++i) {
                            applyToFrames(frame.frames[i]);
                        }
                        
                    };
    
                    applyToFrames(window);
                    
                    chrome.extension.active.then(() => {
                        const popupElem = document.getElementById('hebbia_popup_outer');
                        if (popupElem && applyToPopup) {
                            const popupFrame = popupElem.shadowRoot.getElementById('popup');
                            applyToFrames(popupFrame.contentWindow);
                        }
                    });
                };

            };

            return {
                addListener
            };

        })();

        let activate = function(applyToPopup) {
            _activateClickHandler(applyToPopup);
        };

        let setIcon = function() {};

        return {
            onClicked,
            activate,
            setIcon
        };

    })());

    let contextMenus = Object.assign(chrome.contextMenus || {}, (function() {

        let onClicked = (function() {

            let addListener = function() {};

            return {
                addListener
            };

        })();

        let create = remove = function() {};

        return {
            onClicked,
            create,
            remove
        };

    })());

    let extension = Object.assign(chrome.extension || {}, (function() {

        let _setActive = function() {};

        let active = new Promise(resolve => {
            _setActive = resolve;
        });

        let activate = function() {
            _setActive();
        };

        return {
            active,
            activate
        };

    })());

    return {
        runtime,
        tabs,
        storage,
        webNavigation,
        browserAction,
        contextMenus,
        extension
    };

})());
