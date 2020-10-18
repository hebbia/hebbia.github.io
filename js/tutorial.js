var state = "new";  // new -> extension_opened ->

window.addEventListener("HebbiaExtension", function(event) {
    if (event.detail.type === "popupOpen" && state === "new") {
        $("#hebbiaDiv1 h1").html("Hebbia is in-page search that <em>understands</em>.<br><br>Try it out by typing:");
        $("#hebbiaDiv1 span").html(
            "<div class=\"button\">What are the symptoms?</div>"
            + "<div class=\"button\">How contagious is Covid-19?</div>"
            + "<div class=\"button\">Did it come from a lab?</div>"
        );
        $("#hebbiaDiv1").removeClass("hebbiaDivSelected");
        setTimeout(function() {
            var event = new CustomEvent("HebbiaExtension", {detail: {type: "tutorialTypeQuestion", text: "Did it come from a lab?"}});
            window.dispatchEvent(event);
        }, 2000);
        state = "extension_opened";
    }
});
