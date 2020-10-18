var state = "new";  // new -> extension_opened ->

window.addEventListener("HebbiaExtension", function(event) {
    if(event.detail.type === "popupOpen" && state === "new") {
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Now go fuck yourself");
            $("#hebbiaDiv1 span").html("you piece of shit");
            state = "extension_opened";
        }, 750);
    }
    if(event.detail.type === "popupOpen" && state === "new") {
        setTimeout(function() {
            $("#hebbiaDiv1 h1").html("Now go fuck yourself");
            $("#hebbiaDiv1 span").html("you piece of shit");
            state = "extension_opened";
        }, 750);
    }
});
