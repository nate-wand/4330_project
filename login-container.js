import { signInWithEmailAndPassword, auth } from "./firebase-init.js";
import { bottom_bar } from './app-container.js';
import {reset_password_container, reset_password_field, fake_reset_password_field, reset_password_error_message_container} from './reset-password-container.js';

let email_and_password_fields = document.querySelectorAll('.email-field, .password-field');
let fake_email_and_password_fields = document.querySelectorAll('.fake-email-field, .fake-password-field');
let back_button = document.querySelectorAll('.back-button');
let log_button = document.querySelector('.log-button');
let email_field = document.querySelector('.email-field');
let password_field = document.querySelector('.password-field');
let fake_email_field = document.querySelector('.fake-email-field');
let fake_password_field = document.querySelector('.fake-password-field');
let login_error_message_container = document.querySelector('.login-error-message-container');
let forgot_password_text = document.querySelector('.forgot-password-text');

forgot_password_text.addEventListener('click', (e) => {
  e.preventDefault();

  email_field.value = '';
  password_field.value = '';
  fake_email_field.textContent = 'Enter your email';
  fake_password_field.textContent = 'Enter your password';
  login_container.style.display = 'none';
  login_error_message_container.style.display = 'none';
  reset_password_container.style.display = 'flex';
  reset_password_field.value = '';
  fake_reset_password_field.textContent = 'Enter your email';
  reset_password_error_message_container.style.display = 'none';

});

back_button[0].addEventListener('click', () => {
  email_field.value = '';
  password_field.value = '';
  fake_email_field.textContent = 'Enter your email';
  fake_password_field.textContent = 'Enter your password';
  login_container.style.display = 'none';
  login_signup_container.style.display = 'flex';
  login_error_message_container.style.display = 'none';

});

email_and_password_fields.forEach((real_element, i) => {
  real_element.addEventListener('focus', () => {
    real_element.style.opacity = 0;

    fake_email_and_password_fields.forEach((fake_element, j) => {
      if (i === j) {
        fake_element.style.opacity = 1;

      }

    });

    setTimeout(() => {
      fake_email_and_password_fields.forEach((fake_element, j) => {
        if (i === j) {
          fake_element.style.opacity = 0;

        }

      });

      real_element.style.opacity = 1;

    }, 300);

  });

  real_element.addEventListener('blur', () => {
    fake_email_and_password_fields.forEach((fake_element, j) => {
      if (i === j) {
        fake_element.textContent = real_element.value;

        if (real_element.value === '') {
          switch (j) {
            case 0:
              fake_element.textContent = 'Enter your email';
              break;
            
            case 1:
              fake_element.textContent = 'Enter your password';
              break;

          }

        }

      }

    });

  });

  real_element.addEventListener('touchend', () => {
    if (document.activeElement !== real_element) {
      real_element.focus();

    }

  });

});

log_button.addEventListener('click', (e) => {
  e.preventDefault();

  signInWithEmailAndPassword(auth, email_field.value, password_field.value)
  .then((userCredential) => {
    const user = userCredential.user;
    bottom_bar.style.pointerEvents = 'auto';
    app_container.classList.remove('not-in-use');
    bottom_bar.style.bottom = '0px';
    email_field.value = '';
    password_field.value = '';
    fake_email_field.textContent = 'Enter your email';
    fake_password_field.textContent = 'Enter your password';
    login_container.style.display = 'none';
    app_container.style.display = 'block';
    login_error_message_container.style.display = 'none';
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    login_error_message_container.style.display = 'block';
  });

});

export { back_button, email_field, fake_email_field, password_field, fake_password_field, login_error_message_container };