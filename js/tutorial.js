var state = "new";  // new -> extension_opened -> question_typed -> done

window.addEventListener("HebbiaExtension", function(event) {
    console.log(event.detail);
    if (event.detail.type === "popupOpen" && state === "new") {
        $("#hebbiaDiv1 h1").html("Hebbia is in-page search that <em>understands</em>.<br><br>Try it out by typing:");
        $("#hebbiaDiv1 span").html(
            "<div class=\"button\">What are the symptoms?</div>"
            + "<div class=\"button\">How contagious is Covid-19?</div>"
            + "<div class=\"button\">Did it come from a lab?</div>"
        );
        $("#wikiContent").removeClass("hidden");
        state = "extension_opened";
    }
    if (event.detail.type === "queryTyped" && event.detail.text.length > 3 && state === "extension_opened") {
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Hit ENTER to view your matches.");
            $("#hebbiaDiv1 span").html(
                "Hit ENTER again to view the next result<br>"
                + "Hit Shift+ENTER to view the previous result"
            );
            state = "question_typed";
        }, 1000);
    }
    if (event.detail.type === "enter" && state === "question_typed") {
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("You're all set!");
            $("#hebbiaDiv1 span").html("Now go get'em!");
            state = "done";
        }, 1000);
    }
});
