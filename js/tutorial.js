var state = "new";  // new -> extension_opened -> question_typed -> done

window.addEventListener("HebbiaExtension", function(event) {
    console.log(event.detail);
    if (event.detail.type === "popupOpen" && state === "new") {
        $("#hebbiaDiv1 h1").html("Hebbia is AI search that <em>understands</em>.<br><br>Try it out by typing:");
        $("#hebbiaDiv1 span").html(
            "<div class=\"button\">What are the symptoms?</div>"
            + "<div class=\"button\">How many people have been infected?</div>"
            + "<div class=\"button\">Where did COVID originate?</div>"
        );
        $("#wikiContent").animate({opacity: "100%"}, 3000)
        // $("#wikiContent").removeClass("hidden");
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
