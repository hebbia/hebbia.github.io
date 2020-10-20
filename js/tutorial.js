var state = "new";  // new -> extension_opened -> question_typed -> viewing_results -> done

window.addEventListener("HebbiaExtension", function(event) {
    console.log("received!", event);
    if (event.detail.type === "popupOpen" && state === "new") {
        state = "extension_opened";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Let's try asking about symptoms on this long COVID article.");
            $("#hebbiaDiv1 span").html(
                ""
            );

            $("#wikiContent").animate({opacity: "100%"}, 3000);
            setTimeout(function() {
              typeQuestion("What are the symptoms?", 0);
            }, 2500);

            setTimeout(function() {
                $("#hebbiaDiv1 span").html(
                    "Hit <span class=\"shortcut\">return</span> to search."
                );
                state = "question_typed";
            }, 5500);
        }, 500);
    }
    if (event.detail.type === "enter" && state === "question_typed") {
        state = "viewing_results";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Relevant sentences are highlighted. Enter your way through them.");
            $("#hebbiaDiv1 span").html(
                "Click matches to rank them and update results."
                + "<br /> Double click them to immediately see similar sentences. </div>"
            );
        }, 500);
    }
    if ((event.detail.type === "enter" || event.detail.type === "labelClicked") && state === "viewing_results") {
        state = "done";
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Ask Hebbia anything.");
            $("#hebbiaDiv1 span").html(
                "<br /> Here are some examples:"
                + "<div id=\"b1\" class=\"button\"><img src=\"img/icon_copy.svg\"> How many people have been infected?</div>"
                + "<div id=\"b2\" class=\"button\"><img src=\"img/icon_copy.svg\"> How is it transmitted?</div>"
                + "<div id=\"b3\" class=\"button\"><img src=\"img/icon_copy.svg\"> Where did COVID originate?</div>"
                + "<div id=\"b4\" class=\"button\"><img src=\"img/icon_copy.svg\"> Is it fake news? </div>"
                + "<div id=\"b5\" class=\"button\"><img src=\"img/icon_copy.svg\"> What is the R number?</div>"
                + "<div id=\"b6\" class=\"button\"><img src=\"img/icon_copy.svg\"> What are the economic effects?</div>"
                + "<div id=\"b7\" class=\"button\"><img src=\"img/icon_copy.svg\"> What has the WHO said?</div>"
                + "<span class=\"subsubtitle\">copy to clipboard</span>"
                );
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
        setTimeout(function() {
            $(selector).attr("src", "img/icon_copy.svg");
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
