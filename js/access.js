const scriptURL = 'https://script.google.com/macros/s/AKfycbw40jIFq3G0nHinvoJqJAmhcbt46gCf_zr0MZtuZKNTLHkcFhQ/exec';
const form = document.forms['submit-to-google-sheet'];


const promoCodeBaseURL = 'http://0.0.0.0:5000/promo_code_check/?promo_code=';

form.addEventListener('submit', e => {
  e.preventDefault();
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => console.log('Success!', response))
    .catch(error => console.error('Error!', error.message));

  let promoEntered = document.getElementById('access-code').value;
  let promoCodeURL = promoCodeBaseURL + promoEntered;


  fetch(promoCodeURL, { method: 'GET'})

    .then(response => {
      console.log('Correct code!');
      console.log(response);
      window.location.href = response.data;
    })

    .catch(error => console.error('Error!', error.message));

  form.reset()

  document.getElementById("thanks").style.display = "block";

})