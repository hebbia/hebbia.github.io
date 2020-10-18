// chrome.runtime.onMessageExternal.addListener(
//   function(request, sender, sendResponse) {
//     console.log("Received message!");
//     console.log(request, sender, sendResponse);
//   });

var state = "new";  // new -> extension_opened ->

window.addEventListener("HebbiaExtension", function(event) {
    if(event.detail.type === "popupOpen" && state === "new") {
        console.log($("#hebbiaDiv1").position())
        $("#hebbiaDiv1").removeClass("hebbiaDivSelected");
        $("#hebbiaDiv1").animate({position: 'absolute', margin: 'inherit', left: 'inherit', right: '70px'}, "slow");
        $("#hebbiaDiv2").show().addClass("hebbiaDivSelected");
        state = "extension_opened";
    }
});
