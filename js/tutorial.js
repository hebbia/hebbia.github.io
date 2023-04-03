//INIT GOOGLE ANALYTICS SHIT


if (window.location.hostname === "") {
  // Standard Google Universal Analytics code
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
  
  ga('create', 'UA-157284380-2', 'auto'); // Enter your GA identifier
  ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
  ga('send', 'pageview', '/tutorial.html'); // Specify the virtual path
} else ga = function() {
    console.log('ga(' + [...arguments].map(JSON.stringify).join(', ') + ')');
};




var timeout;
var currStep;
var state;  // new -> extension_opened -> question_typed -> viewing_results -> viewing_next_result -> viewed_results -> viewed_next_result -> freeform_questions -> done
var enterKeyName = getOS() === "Mac" ? "return" : "enter";
var commandKeyName = getOS() === "Mac" ? "\u2318" : "Alt"; //What went wrong? //political impacts
var buttons = (
    "<div id=\"b1\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
    + "<div id=\"b2\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> Why does soap kill it?</div>"
    + "<div id=\"b3\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> How is it transmitted? </div>"
    + "<div id=\"b4\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b5\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b6\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

var buttonsLess = (
    "<div id=\"b1\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
    +"<div id=\"b2\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> Why does soap kill it?</div>"
    + "<div id=\"b3\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b4\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b5\" class=\"copy button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

$(window).on('load', function() {
    const emailForm = document.forms['enter_email'];
    const cohortForm = document.forms['select_cohort'];
    document.body.style['overflow-y'] = 'hidden';
    $(".signup_later").on('click', function() {
        $("#signup_p1").hide();
        $("#signup_p2").hide();
        $("#wikiContent").show();
        $("#cover").fadeOut(1000)
        $('#logo_hebbia').hide();
        document.body.style['overflow-y'] = 'scroll';
        window.addEventListener("HebbiaExtension", handleStateChange);
    });
    emailForm.addEventListener('submit', e => {
        e.preventDefault();

        const mailingListURL = 'https://api2./mailing_list/';
        const mailingListTags = ["Tutorial Signup"];
        const mailingListData = JSON.stringify({
            email: $("#email").val(),
            tags: mailingListTags
        });
        fetch(mailingListURL, {method: 'POST', body: mailingListData})
            .then(response => {
                if (!response.ok) {
                    return response.text();
                }
            })
            .then(err => {if (err) throw Error(err);})
            .catch(console.log);

        window.postMessage({type: "storeData", field: "email", value: $("#email").val()}, '*');
        $("#signup_p1").hide();
        $("#signup_p2").show();
    });
    cohortForm.addEventListener('submit', e => {
        e.preventDefault();
        window.postMessage({type: "storeData", field: "cohort", value: $("#cohort").val()}, '*');
        $("#signup_p2").hide();
        $("#wikiContent").show();
        $("#cover").fadeOut(1000)
        $('#logo_hebbia').hide();
        document.body.style['overflow-y'] = 'scroll';
        window.addEventListener("HebbiaExtension", handleStateChange);
    });
});

function sendAnalytics(action, label=null) {
    const page = '/tutorial.html';
    if (label) {
        ga('send', 'event', 'tutorial', action, label);
        window.postMessage({type: 'analytics', location: page, data: {
            eventCategory: 'tutorial',
            eventAction: action,
            eventLabel: label
        }}, '*');
    } else {
        ga('send', 'event', 'tutorial', action);
        window.postMessage({type: 'analytics', location: page, data: {
            eventCategory: 'tutorial',
            eventAction: action
        }}, '*');
    }
}

function handleStateChange(event) {
    if (event.detail.type === "popupOpen" && state === "new") {
        sendAnalytics('1) started');
        currStep = 1;
        timeout = setTimeout(function() {
            state = goToStep(currStep);
        }, 500);
    }
    if (event.detail.type === "enter" && state === "question_typed") {
        sendAnalytics('2) firstQuery');
        currStep = 2;
        timeout = setTimeout(function() {
            state = goToStep(currStep);
        }, 500);    }
    if (event.detail.type === "enter" && state === "viewed_results") {
        sendAnalytics('3) resultsViewed');
        currStep = 3;
        timeout = setTimeout(function() {
            state = goToStep(currStep);
        }, 1000);    }
    if (event.detail.type == "labelClicked" && state === "viewed_next_result") {
        sendAnalytics('4) highlightDoubleClicked');
        currStep = 4;
        timeout = setTimeout(function() {
            state = goToStep(currStep);
        }, 500);    }
    if (event.detail.type == "enter" && state == "freeform_questions") {
        sendAnalytics('5) additionalQueries');
        currStep = 5;
        timeout = setTimeout(function() {
            state = goToStep(currStep);
        }, 500);    }
}


function goToStep(i) {
    switch(i) {
        case 1:
            $("#hebbiaDiv1 #prev").hide();

            $("#hebbiaDiv1 h1").html("Let's try asking about the virus's origins on this long COVID article.");
            $("#hebbiaDiv1 .subtitle").html("");

            $("#wikiContent").animate({opacity: "100%"}, 3000);

            timeout = setTimeout(function() {
                typeQuestion("Where did COVID originate?", 0);

                timeout = setTimeout(function() {
                    $("#hebbiaDiv1 .subtitle").html(
                        "Hit <span class=\"shortcut\">" + enterKeyName + "</span> to search."
                    );
    
                    state = "question_typed";
                }, 3000);
            }, 3000);

            return "extension_opened";

        case 2:
            $("#hebbiaDiv1 #prev").show();

            $("#hebbiaDiv1 h1").html("Relevant sentences are highlighted.");
            $("#hebbiaDiv1 .subtitle").html("<span class=\"shortcut\">" + enterKeyName + "</span> to jump through results.");

            return "viewed_results";

        case 3:
            $("#hebbiaDiv1 h1").html("Cmd-H can learn <em>live</em>");
            $("#hebbiaDiv1 .subtitle").html("<br /> <h2>Double click a highlight to show you similar sentences.</h2>");

            return "viewed_next_result";

        case 4:
            $("#hebbiaDiv1 #goPrevNext").hide();

            $("#hebbiaDiv1 h1").html("Great! To see the power of Cmd-H, ask <em>anything</em> you'd like. We've generated sample questions for you.");
            $("#hebbiaDiv1 .subtitle").html("");
            $("#hebbiaDiv1").addClass("showQuestions");
            $("#hebbiaDiv1").css('top', 320);

            return "freeform_questions";

        case 5:
            $("#hebbiaDiv1").css('top', 145);
            $("#hebbiaDiv1").removeClass("showQuestions");
            $("#hebbiaDiv1 #next").hide();
            $("#hebbiaDiv1 #prev").show()
            $("#hebbiaDiv1 #goPrevNext").show();
            $("#hebbiaDiv1 h1").html("You're good to go!");

            $("#hebbiaDiv1 .subtitle").html("<br /> <h2>  Cmd-H pops up when it can be most helpful. Pin <img src=\"img/icon_pin.svg\"> the icon under <img src=\"img/icon_extension.svg\"> in your toolbar! </h2>");
            addCopyListeners();

            return "done";

        default:
            currStep = 0;
            $("#hebbiaDiv1 #goPrevNext").hide();

            $("#hebbiaDiv1 h1").html("Thanks for installing Hebbia!");
            if (getOS() === "Mac") {
                $("#hebbiaDiv1 .subtitle").html("<span class=\"shortcut\">\u2318</span> + <span class=\"shortcut\">H</span> to begin.");
            } else {
                $("#hebbiaDiv1 .subtitle").html("<span class=\"shortcut\">Alt</span> + <span class=\"shortcut\">H</span> to begin.");
            }

            return "new";
    }
}


function addCopyListeners() {
    $(".copy").click(function(event) {
        sendAnalytics('contentCopied', event.currentTarget.innerText.substr(1));
        $("#copyHelper").val(event.currentTarget.innerText).focus().select();
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val(event.currentTarget.innerText.substr(1)).select();
        document.execCommand("copy");
        $temp.remove();
        var selector = "#" + event.currentTarget.id + " img";
        $(selector).attr("src", "img/icon_done.svg");
        $(".subsubtitle").show();
        setTimeout(function() {
            $(selector).attr("src", "img/icon_copy.svg");
            $(".subsubtitle").hide();
        }, 1000);
    });
}


function addHistoryListeners() {
    $("#hebbiaDiv1 #next").click(function(event) {
        sendAnalytics('history', 'next');
        clearTimeout(timeout);
        state = goToStep(++currStep);
    });
    $("#hebbiaDiv1 #prev").click(function(event) {
        sendAnalytics('history', 'prev');
        clearTimeout(timeout);
        state = goToStep(--currStep);
    });
}


function typeQuestion(question, index) {
    if (index > question.length) {
        return;
    }
    var event = new CustomEvent("HebbiaExtension", {detail: {type: "tutorialTypeQuestion", text: question.substr(0, index)}});
    window.dispatchEvent(event);
    setTimeout(function() {
        typeQuestion(question, index + 1);
    }, 100);
}


// Taken from https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
function getOS() {
    var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'darwin'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }
    sendAnalytics('OS', os);

    return os;
}

document.addEventListener('DOMContentLoaded', function () {
    currStep = 0;
    state = goToStep(currStep);
    addHistoryListeners();
});
