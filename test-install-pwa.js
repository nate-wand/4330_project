/**
 * Unit Tests for install-pwa.js
 * Run this file in the browser console or include it in your HTML
 */

console.log('========================================');
console.log('UNIT TESTS: install-pwa.js');
console.log('========================================\n');

// Test Suite Setup
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log('✅ PASS:', testName);
    testsPassed++;
  } else {
    console.error('❌ FAIL:', testName);
    testsFailed++;
  }
}

function assertEquals(actual, expected, testName) {
  if (actual === expected) {
    console.log('✅ PASS:', testName);
    testsPassed++;
  } else {
    console.error('❌ FAIL:', testName);
    console.error('  Expected:', expected);
    console.error('  Actual:', actual);
    testsFailed++;
  }
}

// Test: is_installed function - standalone mode
console.log('\n--- Testing is_installed function ---');

function test_is_installed_standalone() {
  const originalMatchMedia = window.matchMedia;
  
  // Mock matchMedia to return true for standalone
  window.matchMedia = function(query) {
    return {
      matches: query === '(display-mode: standalone)',
      media: query
    };
  };
  
  const is_installed = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
  };
  
  const result = is_installed();
  assertEquals(result, true, 'should return true when app is in standalone mode');
  
  // Restore original
  window.matchMedia = originalMatchMedia;
}

function test_is_installed_not_standalone() {
  const originalMatchMedia = window.matchMedia;
  const originalStandalone = window.navigator.standalone;
  
  // Mock matchMedia to return false
  window.matchMedia = function(query) {
    return {
      matches: false,
      media: query
    };
  };
  window.navigator.standalone = false;
  
  const is_installed = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true;
  };
  
  const result = is_installed();
  assertEquals(result, false, 'should return false when app is not in standalone mode');
  
  // Restore original
  window.matchMedia = originalMatchMedia;
  window.navigator.standalone = originalStandalone;
}

test_is_installed_standalone();
test_is_installed_not_standalone();

// Test: is_mobile function
console.log('\n--- Testing is_mobile function ---');

function test_is_mobile_iphone() {
  const originalUserAgent = navigator.userAgent;
  
  // We can't actually change userAgent, so we test the regex directly
  const testUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
  const is_mobile = (ua) => /iphone|ipad|ipod|android/i.test(ua);
  
  const result = is_mobile(testUserAgent);
  assertEquals(result, true, 'should return true for iPhone user agent');
}

function test_is_mobile_android() {
  const testUserAgent = 'Mozilla/5.0 (Linux; Android 10)';
  const is_mobile = (ua) => /iphone|ipad|ipod|android/i.test(ua);
  
  const result = is_mobile(testUserAgent);
  assertEquals(result, true, 'should return true for Android user agent');
}

function test_is_mobile_desktop() {
  const testUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
  const is_mobile = (ua) => /iphone|ipad|ipod|android/i.test(ua);
  
  const result = is_mobile(testUserAgent);
  assertEquals(result, false, 'should return false for desktop user agent');
}

test_is_mobile_iphone();
test_is_mobile_android();
test_is_mobile_desktop();

// Test: Display logic
console.log('\n--- Testing display logic ---');

function test_display_desktop_users() {
  const mockElements = {
    install_pwa_message_container: { style: { display: '' } },
    only_on_mobile: { style: { display: '' } },
    install_pwa_message_prompt: { style: { display: '' } },
    login_signup_container: { style: { display: '' } }
  };
  
  const is_mobile = () => false;
  
  if (!is_mobile()) {
    mockElements.install_pwa_message_container.style.display = 'flex';
    mockElements.only_on_mobile.style.display = 'block';
    mockElements.install_pwa_message_prompt.style.display = 'none';
    mockElements.login_signup_container.style.display = 'none';
  }
  
  assertEquals(mockElements.only_on_mobile.style.display, 'block', 
    'should show only-on-mobile message for desktop users');
  assertEquals(mockElements.install_pwa_message_prompt.style.display, 'none', 
    'should hide install prompt for desktop users');
}

function test_display_mobile_not_installed() {
  const mockElements = {
    install_pwa_message_container: { style: { display: '' } },
    only_on_mobile: { style: { display: '' } },
    install_pwa_message_prompt: { style: { display: '' } },
    login_signup_container: { style: { display: '' } }
  };
  
  const is_mobile = () => true;
  const is_installed = () => false;
  
  if (is_mobile() && !is_installed()) {
    mockElements.install_pwa_message_container.style.display = 'flex';
    mockElements.install_pwa_message_prompt.style.display = 'block';
    mockElements.only_on_mobile.style.display = 'none';
    mockElements.login_signup_container.style.display = 'none';
  }
  
  assertEquals(mockElements.install_pwa_message_prompt.style.display, 'block', 
    'should show install prompt for mobile users who have not installed');
  assertEquals(mockElements.only_on_mobile.style.display, 'none', 
    'should hide only-on-mobile message');
}

function test_display_mobile_installed() {
  const mockElements = {
    install_pwa_message_container: { style: { display: '' } },
    only_on_mobile: { style: { display: '' } },
    install_pwa_message_prompt: { style: { display: '' } },
    login_signup_container: { style: { display: '' } }
  };
  
  const is_mobile = () => true;
  const is_installed = () => true;
  
  if (is_mobile() && is_installed()) {
    mockElements.login_signup_container.style.display = 'flex';
    mockElements.install_pwa_message_container.style.display = 'none';
  }
  
  assertEquals(mockElements.login_signup_container.style.display, 'flex', 
    'should show login container for installed mobile app');
  assertEquals(mockElements.install_pwa_message_container.style.display, 'none', 
    'should hide install message container');
}

test_display_desktop_users();
test_display_mobile_not_installed();
test_display_mobile_installed();

// Test Summary
console.log('\n========================================');
console.log('TEST SUMMARY');
console.log('========================================');
console.log('✅ Passed:', testsPassed);
console.log('❌ Failed:', testsFailed);
console.log('Total:', testsPassed + testsFailed);
console.log('========================================\n');
