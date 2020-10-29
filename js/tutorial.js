//INIT GOOGLE ANALYTICS SHIT


var DEBUGGING = false;

if (!DEBUGGING) {
  // Standard Google Universal Analytics code
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
  
  ga('create', 'UA-157284380-2', 'auto'); // Enter your GA identifier
  ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
  ga('send', 'pageview', '/tutorial.html'); // Specify the virtual path
} else ga = function() {};




var state = "new";  // new -> extension_opened -> question_typed -> viewing_results -> viewing_next_result -> viewed_results -> viewed_next_result -> freeform_questions -> done
var enterKeyName = getOS() === "Mac" ? "return" : "enter";
var commandKeyName = getOS() === "Mac" ? "\u2318" : "Alt"; //What went wrong? //political impacts
var buttons = (
    "<div id=\"b1\" class=\"button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
    + "<div id=\"b2\" class=\"button\"><img src=\"img/icon_copy.svg\"> Why does soap kill it?</div>"
    + "<div id=\"b3\" class=\"button\"><img src=\"img/icon_copy.svg\"> How is it transmitted? </div>"
    + "<div id=\"b4\" class=\"button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b5\" class=\"button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b6\" class=\"button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

var buttonsLess = (
    "<div id=\"b1\" class=\"button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
    +"<div id=\"b2\" class=\"button\"><img src=\"img/icon_copy.svg\"> Why does soap kill it?</div>"
    + "<div id=\"b3\" class=\"button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b4\" class=\"button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b5\" class=\"button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

 

window.addEventListener("HebbiaExtension", function(event) {
    if (event.detail.type === "popupOpen" && state === "new") {
        ga('send', 'event', 'tutorial', '1) started');
        state = "extension_opened";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Let's try asking about the virus's origins on this long COVID article.");
            $("#hebbiaDiv1 span").html("");

            $("#wikiContent").animate({opacity: "100%"}, 3000);
            setTimeout(function() {
              typeQuestion("Where did COVID originate?", 0);
            }, 3000);

            setTimeout(function() {
                $("#hebbiaDiv1 span").html(
                    "Hit <span class=\"shortcut\">" + enterKeyName + "</span> to search."
                );
                state = "question_typed";
            }, 6000);
        }, 500);
    }
    if (event.detail.type === "enter" && state === "question_typed") {
        ga('send', 'event', 'tutorial', '2) firstQuery');
        state = "viewing_results";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Relevant sentences are highlighted.");
            $("#hebbiaDiv1 span").html("<span class=\"shortcut\">" + enterKeyName + "</span> to jump through results.");
            state = "viewed_results";
        }, 500);
    }
    if (event.detail.type === "enter" && state === "viewed_results") {
        ga('send', 'event', 'tutorial', '3) resultsViewed');
        state = "viewing_next_result";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Hebbia can learn <em>live</em>");
            $("#hebbiaDiv1 span").html("<br /> <h2>Double click a highlight to show you similar sentences.</h2>");
            state = "viewed_next_result";
        }, 1000);
    }
    if (event.detail.type == "labelClicked" && state === "viewed_next_result") {
        ga('send', 'event', 'tutorial', '4) highlightDoubleClicked');
        state = "freeform_questions";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Great! To see the power of Hebbia, ask <em>anything</em> you'd like.");
            $("#hebbiaDiv1 span").html("");
        }, 600);
        setTimeout(function() {
            $("#hebbiaDiv1 span").html("<br /> Click to copy an example question:" + buttons + "<br /> ...and start a search with "+commandKeyName+" + H");
            addCopyListeners();
        }, 1600);
    }
    if (event.detail.type == "enter" && state == "freeform_questions") {
        ga('send', 'event', 'tutorial', '5) additionalQueries');
        state = "done";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Great! To see the power of Hebbia, ask <em>anything</em> you'd like.");
            $("#hebbiaDiv1 span").html("<br /> Click to copy some example questions:" + buttonsLess + "<br> <h1>You're good to go!</h1> <h2> Hebbia works with any website. </h2>");
            addCopyListeners();
        }, 500);
    }
});


function addCopyListeners() {
    $(".button").click(function(event) {
        ga('send', 'event', 'tutorial', 'contentCopied', event.currentTarget.innerText.substr(1));
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
    ga('send', 'event', 'tutorial', 'OS', os);

    return os;
}

document.addEventListener('DOMContentLoaded', function () {
    if (getOS() === "Mac") {
        $("#hebbiaDiv1 span").html("<span class=\"shortcut\">\u2318</span> + <span class=\"shortcut\">H</span> to begin.");
    } else {
        $("#hebbiaDiv1 span").html("<span class=\"shortcut\">Alt</span> + <span class=\"shortcut\">H</span> to begin.");
    }
});
