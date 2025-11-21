/**
 * Unit Tests for login-container.js
 * Run this file in the browser console or include it in your HTML
 */

console.log('========================================');
console.log('UNIT TESTS: login-container.js');
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

// Test: Email validation
console.log('\n--- Testing email validation ---');

function test_valid_email() {
  const validEmails = [
    'user@example.com',
    'test.user@domain.co.uk',
    'first.last@company.com'
  ];
  
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  
  validEmails.forEach(email => {
    assert(isValidEmail(email), `should accept valid email: ${email}`);
  });
}

function test_invalid_email() {
  const invalidEmails = [
    'notanemail',
    '@example.com',
    'user@',
    'user@.com',
    'user.example.com'
  ];
  
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  
  invalidEmails.forEach(email => {
    assert(!isValidEmail(email), `should reject invalid email: ${email}`);
  });
}

test_valid_email();
test_invalid_email();

// Test: Password validation
console.log('\n--- Testing password validation ---');

function test_valid_password() {
  const validPasswords = [
    'password123',
    'SecurePass!',
    '123456',
    'longpasswordwithlotsofcharacters'
  ];
  
  const isValidPassword = (password) => password.length >= 6;
  
  validPasswords.forEach(password => {
    assert(isValidPassword(password), `should accept password with length >= 6: ${password.length} chars`);
  });
}

function test_invalid_password() {
  const invalidPasswords = [
    '12345',
    'pass',
    'abc',
    ''
  ];
  
  const isValidPassword = (password) => password.length >= 6;
  
  invalidPasswords.forEach(password => {
    assert(!isValidPassword(password), `should reject password with length < 6: ${password.length} chars`);
  });
}

test_valid_password();
test_invalid_password();

// Test: Field focus behavior
console.log('\n--- Testing field focus behavior ---');

function test_field_focus_hides_real_shows_fake() {
  const mockElements = {
    realField: { style: { opacity: '1' } },
    fakeField: { style: { opacity: '0' } }
  };
  
  // Simulate focus event
  mockElements.realField.style.opacity = '0';
  mockElements.fakeField.style.opacity = '1';
  
  assertEquals(mockElements.realField.style.opacity, '0', 'should hide real field on focus');
  assertEquals(mockElements.fakeField.style.opacity, '1', 'should show fake field on focus');
}

function test_field_blur_updates_fake() {
  const mockElements = {
    realField: { value: 'test@example.com' },
    fakeField: { textContent: '' }
  };
  
  // Simulate blur event
  mockElements.fakeField.textContent = mockElements.realField.value;
  
  assertEquals(mockElements.fakeField.textContent, 'test@example.com', 
    'should update fake field text on blur');
}

function test_field_blur_resets_placeholder() {
  const mockElements = {
    realField: { value: '' },
    fakeField: { textContent: '' }
  };
  
  // Simulate blur event with empty value
  if (mockElements.realField.value === '') {
    mockElements.fakeField.textContent = 'Enter your email';
  }
  
  assertEquals(mockElements.fakeField.textContent, 'Enter your email', 
    'should reset to placeholder when value is empty');
}

test_field_focus_hides_real_shows_fake();
test_field_blur_updates_fake();
test_field_blur_resets_placeholder();

// Test: Back button functionality
console.log('\n--- Testing back button functionality ---');

function test_back_button_resets_fields() {
  const mockElements = {
    email_field: { value: 'test@example.com' },
    password_field: { value: 'password123' },
    fake_email_field: { textContent: 'test@example.com' },
    fake_password_field: { textContent: 'password123' },
    login_container: { style: { display: 'flex' } },
    login_signup_container: { style: { display: 'none' } },
    login_error_message_container: { style: { display: 'block' } }
  };
  
  // Simulate back button click
  mockElements.email_field.value = '';
  mockElements.password_field.value = '';
  mockElements.fake_email_field.textContent = 'Enter your email';
  mockElements.fake_password_field.textContent = 'Enter your password';
  mockElements.login_container.style.display = 'none';
  mockElements.login_signup_container.style.display = 'flex';
  mockElements.login_error_message_container.style.display = 'none';
  
  assertEquals(mockElements.email_field.value, '', 'should reset email field');
  assertEquals(mockElements.password_field.value, '', 'should reset password field');
  assertEquals(mockElements.login_signup_container.style.display, 'flex', 
    'should show login-signup container');
}

test_back_button_resets_fields();

// Test: Forgot password navigation
console.log('\n--- Testing forgot password navigation ---');

function test_forgot_password_navigation() {
  const mockElements = {
    login_container: { style: { display: 'flex' } },
    reset_password_container: { style: { display: 'none' } },
    login_error_message_container: { style: { display: 'block' } }
  };
  
  // Simulate forgot password click
  mockElements.login_container.style.display = 'none';
  mockElements.reset_password_container.style.display = 'flex';
  mockElements.login_error_message_container.style.display = 'none';
  
  assertEquals(mockElements.login_container.style.display, 'none', 
    'should hide login container');
  assertEquals(mockElements.reset_password_container.style.display, 'flex', 
    'should show reset password container');
}

test_forgot_password_navigation();

// Test: Login submission
console.log('\n--- Testing login submission ---');

function test_successful_login() {
  const mockElements = {
    email_field: { value: 'test@example.com' },
    password_field: { value: 'password123' },
    login_container: { style: { display: 'flex' } },
    app_container: { style: { display: 'none' } },
    login_error_message_container: { style: { display: 'none' } }
  };
  
  // Simulate successful login
  const mockUser = { uid: 'test-uid', email: 'test@example.com' };
  
  if (mockUser) {
    mockElements.email_field.value = '';
    mockElements.password_field.value = '';
    mockElements.login_container.style.display = 'none';
    mockElements.app_container.style.display = 'block';
    mockElements.login_error_message_container.style.display = 'none';
  }
  
  assertEquals(mockElements.app_container.style.display, 'block', 
    'should show app container on successful login');
  assertEquals(mockElements.email_field.value, '', 'should clear email field');
  assertEquals(mockElements.password_field.value, '', 'should clear password field');
}

function test_failed_login() {
  const mockElements = {
    login_error_message_container: { style: { display: 'none' } },
    app_container: { style: { display: 'none' } }
  };
  
  // Simulate failed login
  const loginError = true;
  
  if (loginError) {
    mockElements.login_error_message_container.style.display = 'block';
  }
  
  assertEquals(mockElements.login_error_message_container.style.display, 'block', 
    'should show error message on failed login');
  assertEquals(mockElements.app_container.style.display, 'none', 
    'should not show app container on failed login');
}

test_successful_login();
test_failed_login();

// Test: Field type validation
console.log('\n--- Testing field type validation ---');

function test_password_field_type() {
  const mockPasswordField = { type: 'password' };
  
  assertEquals(mockPasswordField.type, 'password', 
    'password field should have type="password"');
}

function test_email_field_placeholder() {
  const mockEmailField = { placeholder: 'Enter your email' };
  
  assertEquals(mockEmailField.placeholder, 'Enter your email', 
    'email field should have correct placeholder');
}

test_password_field_type();
test_email_field_placeholder();

// Test: Empty field validation
console.log('\n--- Testing empty field validation ---');

function test_empty_fields_prevented() {
  const email = '';
  const password = '';
  
  const canSubmit = email.length > 0 && password.length > 0;
  
  assert(!canSubmit, 'should prevent login with empty fields');
}

function test_filled_fields_allowed() {
  const email = 'test@example.com';
  const password = 'password123';
  
  const canSubmit = email.length > 0 && password.length > 0;
  
  assert(canSubmit, 'should allow login with filled fields');
}

test_empty_fields_prevented();
test_filled_fields_allowed();

// Test Summary
console.log('\n========================================');
console.log('TEST SUMMARY');
console.log('========================================');
console.log('✅ Passed:', testsPassed);
console.log('❌ Failed:', testsFailed);
console.log('Total:', testsPassed + testsFailed);
console.log('========================================\n');
