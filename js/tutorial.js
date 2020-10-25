var state = "new";  // new -> extension_opened -> question_typed -> viewing_results -> viewing_next_result -> viewed_results -> viewed_next_result -> freeform_questions -> done
var enterKeyName = getOS() === "Mac" ? "return" : "enter";
var buttons = (
    "<div id=\"b1\" class=\"button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
    + "<div id=\"b2\" class=\"button\"><img src=\"img/icon_copy.svg\"> Why does soap kill it?</div>"
    + "<div id=\"b4\" class=\"button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b5\" class=\"button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b6\" class=\"button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<div id=\"b7\" class=\"button\"><img src=\"img/icon_copy.svg\"> What has the WHO said?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

var buttonsLess = (
    "<div id=\"b2\" class=\"button\"><img src=\"img/icon_copy.svg\"> How is it transmitted?</div>"
    + "<div id=\"b4\" class=\"button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
    + "<div id=\"b5\" class=\"button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
    + "<div id=\"b6\" class=\"button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
    + "<div id=\"b7\" class=\"button\"><img src=\"img/icon_copy.svg\"> What has the WHO said?</div>"
    + "<span class=\"subsubtitle\" style=\"display:none;\">Copied to clipboard</span>"
);

 

window.addEventListener("HebbiaExtension", function(event) {
    if (event.detail.type === "popupOpen" && state === "new") {
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
        state = "viewing_results";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Relevant sentences are highlighted.");
            $("#hebbiaDiv1 span").html("Hit <span class=\"shortcut\">" + enterKeyName + "</span> to jump through results.");
            state = "viewed_results";
        }, 500);
    }
    if (event.detail.type === "enter" && state === "viewed_results") {
        state = "viewing_next_result";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Hebbia can learn <em>live</em>");
            $("#hebbiaDiv1 span").html("<br /> <h2>Double click a highlight to show you similar sentences.</h2>");
            state = "viewed_next_result";
        }, 1000);
    }
    if (event.detail.type == "labelClicked" && state === "viewed_next_result") {

    // if (event.detail.type === "enter" && state === "viewed_results") { //TODO DELETE THIS LINE AND UNCOMMENT THE ABOVE
        state = "freeform_questions";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Great! To see the power of Hebbia, ask <em>anything</em> you'd like.");
            $("#hebbiaDiv1 span").html("");
        }, 500);
        setTimeout(function() {
            $("#hebbiaDiv1 span").html("<br /> Click to copy some example questions:" + buttons);
            addCopyListeners();
        }, 1500);
    }
    if (event.detail.type == "enter" && state == "freeform_questions") {
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
        console.log(event);
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

    return os;
}

document.addEventListener('DOMContentLoaded', function () {
    if (getOS() === "Mac") {
        $("#hebbiaDiv1 span").html("<span class=\"shortcut\">\u2318</span> + <span class=\"shortcut\">H</span> to begin.");
    } else {
        $("#hebbiaDiv1 span").html("<span class=\"shortcut\">Alt</span> + <span class=\"shortcut\">H</span> to begin.");
    }
});
