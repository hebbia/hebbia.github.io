var state = "new";  // new -> extension_opened ->

window.addEventListener("HebbiaExtension", function(event) {
    if(event.detail.type === "popupOpen" && state === "new") {
        $("#hebbiaDiv1 h1").html("Hebbia is in-page search that <em>understands</em>.<br><br>Try it out:");
        $("#hebbiaDiv1 span").html(
            "<div class=\"button\">What are the symptoms?</div>"
            + "<div class=\"button\">How contagious is Covid-19?</div>"
            + "<div class=\"button\">Did COVID-19 come from a Chinese lab?</div>"
        );
        $(".button").click(function(event) {
            console.log("click event!", event)
        });
        state = "extension_opened";
    }
});
