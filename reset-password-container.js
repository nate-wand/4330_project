import {email_field, password_field, fake_email_field, fake_password_field, login_error_message_container} from './login-container.js';
import { sendPasswordResetEmail, auth } from './firebase-init.js';

let reset_password_back_button = document.querySelector('.reset-password-back-button');
let reset_password_container = document.querySelector('.reset-password-container');
let reset_password_field = document.querySelector('.reset-password-field');
let fake_reset_password_field = document.querySelector('.fake-reset-password-field');
let reset_password_button = document.querySelector('.reset-password-button');
let reset_password_error_message_container = document.querySelector('.reset-password-error-message-container');

reset_password_back_button.addEventListener('click', () => {
  email_field.value = '';
  password_field.value = '';
  fake_email_field.textContent = 'Enter your email';
  fake_password_field.textContent = 'Enter your password';
  login_error_message_container.style.display = 'none';
  login_container.style.display = 'flex';
  reset_password_container.style.display = 'none';
  reset_password_field.value = '';
  fake_reset_password_field.textContent = 'Enter your email';
  reset_password_error_message_container.style.display = 'none';

});

reset_password_field.addEventListener('focus', () => {
  reset_password_error_message_container.style.display = 'none';
  reset_password_field.style.opacity = 0;
  fake_reset_password_field.style.opacity = 1;

  setTimeout(() => {
    fake_reset_password_field.style.opacity = 0;
    reset_password_field.style.opacity = 1;

  }, 300);

});

reset_password_field.addEventListener('blur', () => {
  fake_reset_password_field.textContent = reset_password_field.value;

  if (reset_password_field.value === '') {
    fake_reset_password_field.textContent = 'Enter your email';


  }


});

reset_password_field.addEventListener('touchend', () => {
  if (document.activeElement !== reset_password_field) {
    reset_password_field.focus();

  }

});

reset_password_button.addEventListener('click', (e) => {
  e.preventDefault();

  sendPasswordResetEmail(auth, reset_password_field.value)
    .then(() => {
      reset_password_error_message_container.style.display = 'block';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      reset_password_error_message_container.style.display = 'block';
    });

});

export {reset_password_container, reset_password_field, fake_reset_password_field, reset_password_error_message_container}