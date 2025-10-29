let login_signup_container = document.querySelector('.login-signup-container');
let login_button = document.querySelector('.login-button');
let login_container = document.querySelector('.login-container');
let signup_button = document.querySelector('.signup-button');
let signup_container = document.querySelector('.signup-container');
let app_container = document.querySelector('.app-container');

login_button.addEventListener('click', () => {
  login_signup_container.style.display = 'none';
  login_container.style.display = 'flex';

});

signup_button.addEventListener('click', () => {
  login_signup_container.style.display = 'none';
  signup_container.style.display = 'flex';

});