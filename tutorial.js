var state = "new";  // new -> extension_opened ->

window.addEventListener("HebbiaExtension", function(event) {
    if(event.detail.type === "popupOpen" && state === "new") {
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Hebbia is in-page search that <em>understands</em>.<br><br>Try it out:");
            $("#hebbiaDiv1 span").html(
                "Type a question into the search bar:<br><br>"
                // + "<ul>"
                + "<button>What are the symptoms?</button>"
                + "<br>- How contagious is Covid-19?"
                + "<br>- Did COVID-19 come from a Chinese lab?"
                // + "</ul>"
            );
            state = "extension_opened";
        }, 0);
    }
    // if(event.detail.type === "popupOpen" && state === "new") {
    //     setTimeout(function() {
    //         $("#hebbiaDiv1 h1").html("Now go fuck yourself");
    //         $("#hebbiaDiv1 span").html("you piece of shit");
    //         state = "extension_opened";
    //     }, 750);
    // }
});
