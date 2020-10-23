const scriptURL = 'https://script.google.com/macros/s/AKfycbw40jIFq3G0nHinvoJqJAmhcbt46gCf_zr0MZtuZKNTLHkcFhQ/exec';
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

}