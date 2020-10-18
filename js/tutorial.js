var state = "new";  // new -> extension_opened -> question_typed

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
        console.log("poop");
        state = "question_typed";
    }
});
