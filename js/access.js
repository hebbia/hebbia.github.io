//INIT GOOGLE ANALYTICS SHIT


var DEBUGGING = false;

if (!DEBUGGING) {
  // Standard Google Universal Analytics code
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
  
  ga('create', 'UA-157284380-2', 'auto'); // Enter your GA identifier
  ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
  ga('send', 'pageview', '/access.html'); // Specify the virtual path
} else ga = function() {};



const form = document.forms['submit-to-google-sheet'];

const scriptURL = 'https://script.google.com/macros/s/AKfycbyQ9Jung9Yd-fMDobAnIBPiuuwkRrCkjqNqwiJEqZCQ0q23gFB-/exec';
const promoCodeBaseURL = 'https://api2.hebbia.ai/promo_code_check/?promo_code=';
const mailingListURL = 'https://api2.hebbia.ai/mailing_list/';

const mailingListTags = ["Access Code Signup"];

form.addEventListener('submit', e => {
  e.preventDefault();

  let formData = new FormData(form);
  let promoEntered = document.getElementById('access-code').value;
  let promoCodeURL = promoCodeBaseURL + promoEntered;
  let emailEntered = document.getElementById('email').value;
  let mailingListData = JSON.stringify({
    email: emailEntered,
    tags: mailingListTags
  })

  if(promoEntered){
    fetch(promoCodeURL, {method: 'GET'})

      .then(response => {
        if (response.ok) {
          console.log('Correct code');

          Promise.allSettled([
            response.text(),
            fetch(scriptURL, {method: 'POST', body: formData}),
            fetch(mailingListURL, {method: 'POST', body: mailingListData})
          ])

            .then(responses => responses.map(response => 
              response.status === "fulfilled" ? response.value
                                              : new Response(response.reason, {status: 400})
            ))
            .then(responses => {
              responses
                .slice(1)
                .filter(response => !response.ok)
                .forEach(response => response.text().then(text => console.error("Error:", text)));
              if (responses.slice(1).every(response => response.ok)) console.log('Success!');
              // document.getElementById("thanks").innerText = "Rerouting...";
              let url = responses[0].substr(1, (responses[0].length - 3));
              // Redirect to download page: 
              window.location.href = url;
            });

        } else {
          console.log('Wrong code');
          document.getElementById("thanks").innerText = "Incorrect Access Key";
        }

      })

      .catch(error => console.error('Error!', error.message));
  }
  

  form.reset();

})

function showSurvey() {
  document.getElementById("thanks").innerText = "";
  document.getElementById("iframe").style.display = "inline-block";
  document.getElementById("container").style.height = "auto";
  /*document.getElementById("outerdiv").style.height = "1170px";*/
  document.getElementById("showsurveyspan").style.display = "none";
  document.getElementById("hr_top").style.display = "none";
  document.getElementById("welcome_msg").innerText = "Sign up below: we'll forward an invite shortly!";
  document.getElementById("invitecode").style.display = "none";

}