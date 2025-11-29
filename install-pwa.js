// let install_pwa_message_container = document.querySelector('.install-pwa-message-container');
// let only_on_mobile = document.querySelector('.only-on-mobile');
// let install_pwa_message_prompt = document.querySelector('.install-pwa-message-prompt');
// let splash_screen = document.querySelector('.splash-screen');

// const is_installed = () => {
//   return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// };

// const is_mobile = () => {
//   if (navigator.userAgentData && 'mobile' in navigator.userAgentData) {
//     return navigator.userAgentData.mobile;

//   }

//   return /iphone|ipad|ipod|android/i.test(navigator.userAgent);

// }

// if (!is_mobile()) {
//   install_pwa_message_container.style.display = 'flex';
//   only_on_mobile.style.display = 'block';
//   install_pwa_message_prompt.style.display = 'none';
//   login_signup_container.style.display = 'none';

// } else if (!is_installed()) {
//   install_pwa_message_container.style.display = 'flex';
//   install_pwa_message_prompt.style.display = 'block';
//   only_on_mobile.style.display = 'none';
//   login_signup_container.style.display = 'none';

// } else {
//   login_signup_container.style.display = 'flex';
//   install_pwa_message_container.style.display = 'none';
//   only_on_mobile.style.display = 'none';
//   install_pwa_message_prompt.style.display = 'none';

// }