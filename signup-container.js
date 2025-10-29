import { auth, createUserWithEmailAndPassword, db, setDoc, doc } from './firebase-init.js';
import { back_button } from './login-container.js';
import { bottom_bar } from './app-container.js';

let email_username_and_password_fields = document.querySelectorAll('.username-field, .em-field, .pass-field, .confirm-password-field');
let fake_email_username_and_password_fields = document.querySelectorAll('.fake-username-field, .fake-em-field, .fake-pass-field, .fake-confirm-password-field');
let email_password_username_fields_container = document.querySelector('.email-password-username-fields-container');
let username_field = document.querySelector('.username-field');
let em_field = document.querySelector('.em-field');
let pass_field = document.querySelector('.pass-field');
let confirm_password_field = document.querySelector('.confirm-password-field');
let fake_username_field = document.querySelector('.fake-username-field');
let fake_em_field = document.querySelector('.fake-em-field');
let fake_pass_field = document.querySelector('.fake-pass-field');
let fake_confirm_password_field = document.querySelector('.fake-confirm-password-field');
let sign_button = document.querySelector('.sign-button');
let validation_text = document.querySelector('.validation-text');
let validation_container = document.querySelector('.validation-container');

back_button[1].addEventListener('click', () => {
  username_field.value = '';
  em_field.value = '';
  pass_field.value = '';
  confirm_password_field.value = '';
  fake_username_field.textContent = 'Username';
  fake_em_field.textContent = 'Email';
  fake_pass_field.textContent = 'Password';
  fake_confirm_password_field.textContent = 'Confirm password';
  email_password_username_fields_container.style.transform = `translateY(0px)`;
  signup_container.style.display = 'none';
  login_signup_container.style.display = 'flex';

});

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

let initial_focus = false;

if (!isAndroid()) {
  visualViewport.addEventListener('resize', () => {

      const height_diff = window.innerHeight - visualViewport.height;

      if (height_diff > 150 /*|| isAndroid()*/) {
        if (!initial_focus) {
          initial_focus = true;
          email_password_username_fields_container.style.transform = `translateY(-${((height_diff + 140) / window.innerHeight) * 100}%)`;
          return;

        } else if (initial_focus) {
          return;

        }

      }

  });

} else {
  let keyboardTimeout;
  let keyboardIsOpen = false;
  
  window.addEventListener('resize', () => {
    clearTimeout(keyboardTimeout);
    
    keyboardTimeout = setTimeout(() => {
      const height_diff = window.screen.height - window.innerHeight;
      const shouldBeOpen = height_diff > window.screen.height * 0.2;
      
      if (shouldBeOpen && !keyboardIsOpen) {
        keyboardIsOpen = true;
        if (!initial_focus) {
          initial_focus = true;
          email_password_username_fields_container.style.transform = `translateY(-${((height_diff - 290) / window.innerHeight) * 100}%)`;
        }
      } else if (!shouldBeOpen && keyboardIsOpen) {
        keyboardIsOpen = false;
        document.activeElement?.blur();
      }
    }, 200);
  });

}

email_username_and_password_fields.forEach((real_element, i) => {
  real_element.addEventListener('focus', (e) => {
    e.preventDefault();

    real_element.style.opacity = 0;

    fake_email_username_and_password_fields.forEach((fake_element, j) => {
      if (i === j) {
        fake_element.style.opacity = 1;

      }

    });

    setTimeout(() => {
      fake_email_username_and_password_fields.forEach((fake_element, j) => {
        if (i === j) {
          fake_element.style.opacity = 0;

        }

      });

      real_element.style.opacity = 1;

    }, 300);

  });


  real_element.addEventListener('blur', () => {
    setTimeout(() => {
      if (!document.activeElement.closest('.email-password-username-fields-container')) {
        email_password_username_fields_container.style.transform = `translateY(0px)`;

        initial_focus = false;

      }

    }, 200);

    fake_email_username_and_password_fields.forEach((fake_element, j) => {
      if (i === j) {
        fake_element.textContent = real_element.value;

        if (real_element.value === '') {
          switch (j) {
            case 0:
              fake_element.textContent = 'Username';
              break;

            case 1:
              fake_element.textContent = "Email";
              break;

            case 2:
              fake_element.textContent = 'Password';
              break;

            case 3:
              fake_element.textContent = 'Confirm password';
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

let username_error_status = false;
let em_error_status = false;
let pass_error_status = false;

username_field.addEventListener('keyup', (e) => {
  e.preventDefault();
  
  if (username_field.value.startsWith(' ') || username_field.value.endsWith(' ')) {
    validation_text.textContent = 'Username cannot start or end with a space';
    validation_container.style.display = 'block';
    username_error_status = true;

  } else {
    validation_container.style.display = 'none';
    validation_text.textContent = '';

    if (em_error_status) {
      validation_text.textContent = 'Email cannot start or end with a space';
      validation_container.style.display = 'block';

    } else if (pass_error_status) {
      validation_text.textContent = 'Password cannot start or end with a space';
      validation_container.style.display = 'block';

    }

    username_error_status = false;

  }

});

em_field.addEventListener('keyup', (e) => {
  e.preventDefault();

  if (em_field.value.startsWith(' ') || em_field.value.endsWith(' ')) {
    validation_text.textContent = 'Email cannot start or end with a space';
    validation_container.style.display = 'block';
    em_error_status = true;

  } else {
    validation_container.style.display = 'none';
    validation_text.textContent = '';

    if (username_error_status) {
      validation_text.textContent = 'Username cannot start or end with a space';
      validation_container.style.display = 'block';

    } else if (pass_error_status) {
      validation_text.textContent = 'Password cannot start or end with a space';
      validation_container.style.display = 'block';

    }

    em_error_status = false;

  }

});

pass_field.addEventListener('keyup', (e) => {
  e.preventDefault();

  if (pass_field.value.startsWith(' ') || pass_field.value.endsWith(' ')) {
    validation_text.textContent = 'Password cannot start or end with a space';
    validation_container.style.display = 'block';
    pass_error_status = true;

  } else {
    validation_container.style.display = 'none';
    validation_text.textContent = '';

    if (username_error_status) {
      validation_text.textContent = 'Username cannot start or end with a space';
      validation_container.style.display = 'block';

    } else if (em_error_status) {
      validation_text.textContent = 'Email cannot start or end with a space';
      validation_container.style.display = 'block';

    }

    pass_error_status = false;

  }

});

sign_button.addEventListener('click', (e) => {
  e.preventDefault();

  if (username_error_status || em_error_status || pass_error_status) {
    return;

  } else if (!em_field.value.includes('@')) {
    validation_text.textContent = 'Not a valid email';
    validation_container.style.display = 'block';
    return;

  } else if (pass_field.value !== confirm_password_field.value) {
    validation_text.textContent = 'Passwords do not match';
    validation_container.style.display = 'block';
    return;

  } else {
    createUserWithEmailAndPassword(auth, em_field.value, pass_field.value)
    .then((userCredential) => {
      const user = userCredential.user;
      const lagos_str = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Lagos",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(new Date());

      setDoc(doc(db, 'users', user.uid), {
        username: username_field.value,
        uid: user.uid,
        email: user.email,
        user_prompt_history: [],
        reset: lagos_str,
        day: 0,
        sent_welcome: false,
        last_date_sent: ''

      }).then(() => {
        username_field.value = '';
        em_field.value = '';
        pass_field.value = '';
        confirm_password_field.value = '';
        fake_username_field.textContent = 'Username';
        fake_em_field.textContent = 'Email';
        fake_pass_field.textContent = 'Password';
        fake_confirm_password_field.textContent = 'Confirm password';
        validation_container.style.display = 'none';
        validation_text.textContent = '';
        signup_container.style.display = 'none';
        bottom_bar.style.pointerEvents = 'auto';
        app_container.classList.remove('not-in-use');
        bottom_bar.style.bottom = '0px';
        app_container.style.display = 'block';

      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });


  }

});