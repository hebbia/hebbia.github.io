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



const scriptURL = 'https://script.google.com/macros/s/AKfycbyQ9Jung9Yd-fMDobAnIBPiuuwkRrCkjqNqwiJEqZCQ0q23gFB-/exec';
const form = document.forms['submit-to-google-sheet'];


const promoCodeBaseURL = 'https://api2.hebbia.ai/promo_code_check/?promo_code=';

form.addEventListener('submit', e => {
  e.preventDefault();
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message));

  let promoEntered = document.getElementById('access-code').value;
  let promoCodeURL = promoCodeBaseURL + promoEntered;


  if(promoEntered !== null){
    fetch(promoCodeURL, { method: 'GET'})

      .then(response => {
        if(response.ok){
          response.text().then(function (text) {
            console.log('Correct code')
            // document.getElementById("thanks").innerText = "Rerouting...";
            let url = text.substr(1, (text.length - 3));
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
  

  form.reset()

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