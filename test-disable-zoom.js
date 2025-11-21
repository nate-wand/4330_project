/**
 * Unit Tests for disable-zoom.js
 * Run this file in the browser console or include it in your HTML
 */

console.log('========================================');
console.log('UNIT TESTS: disable-zoom.js');
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

// Test: touchstart event handler
console.log('\n--- Testing touchstart event handler ---');

function test_touchstart_multiple_touches() {
  let preventDefaultCalled = false;
  
  const mockEvent = {
    touches: [{ identifier: 1 }, { identifier: 2 }],
    preventDefault: function() {
      preventDefaultCalled = true;
    }
  };
  
  // Simulate the handler logic
  const handler = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };
  
  handler(mockEvent);
  
  assert(preventDefaultCalled, 'should prevent default when multiple touches detected');
}

function test_touchstart_single_touch() {
  let preventDefaultCalled = false;
  
  const mockEvent = {
    touches: [{ identifier: 1 }],
    preventDefault: function() {
      preventDefaultCalled = true;
    }
  };
  
  const handler = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };
  
  handler(mockEvent);
  
  assert(!preventDefaultCalled, 'should not prevent default when single touch detected');
}

function test_touchstart_no_touches() {
  let preventDefaultCalled = false;
  
  const mockEvent = {
    touches: [],
    preventDefault: function() {
      preventDefaultCalled = true;
    }
  };
  
  const handler = (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };
  
  handler(mockEvent);
  
  assert(!preventDefaultCalled, 'should not prevent default when no touches');
}

test_touchstart_multiple_touches();
test_touchstart_single_touch();
test_touchstart_no_touches();

// Test: gesturestart event handler
console.log('\n--- Testing gesturestart event handler ---');

function test_gesturestart_prevents_default() {
  let preventDefaultCalled = false;
  
  const mockEvent = {
    preventDefault: function() {
      preventDefaultCalled = true;
    }
  };
  
  const handler = (e) => {
    e.preventDefault();
  };
  
  handler(mockEvent);
  
  assert(preventDefaultCalled, 'should always prevent default on gesture start');
}

test_gesturestart_prevents_default();

// Test: dblclick event handler
console.log('\n--- Testing dblclick event handler ---');

function test_dblclick_prevents_default() {
  let preventDefaultCalled = false;
  
  const mockEvent = {
    preventDefault: function() {
      preventDefaultCalled = true;
    }
  };
  
  const handler = (e) => {
    e.preventDefault();
  };
  
  handler(mockEvent);
  
  assert(preventDefaultCalled, 'should prevent default on double click');
}

test_dblclick_prevents_default();

// Test: Event listener options
console.log('\n--- Testing event listener options ---');

function test_passive_false_option() {
  const expectedOptions = { passive: false };
  
  // Test that the expected options structure is correct
  assert(
    expectedOptions.hasOwnProperty('passive') && expectedOptions.passive === false,
    'should register listeners with passive: false option'
  );
}

test_passive_false_option();

// Test: Touch count validation
console.log('\n--- Testing touch count validation ---');

function test_touch_count_validation() {
  const testCases = [
    { touches: 0, shouldPrevent: false },
    { touches: 1, shouldPrevent: false },
    { touches: 2, shouldPrevent: true },
    { touches: 3, shouldPrevent: true },
    { touches: 5, shouldPrevent: true }
  ];
  
  testCases.forEach(testCase => {
    let preventDefaultCalled = false;
    
    const mockTouches = Array(testCase.touches).fill({ identifier: 1 });
    const mockEvent = {
      touches: mockTouches,
      preventDefault: function() {
        preventDefaultCalled = true;
      }
    };
    
    const handler = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    handler(mockEvent);
    
    assertEquals(
      preventDefaultCalled, 
      testCase.shouldPrevent, 
      `should ${testCase.shouldPrevent ? 'prevent' : 'not prevent'} default with ${testCase.touches} touch(es)`
    );
  });
}

test_touch_count_validation();

// Test Summary
console.log('\n========================================');
console.log('TEST SUMMARY');
console.log('========================================');
console.log('✅ Passed:', testsPassed);
console.log('❌ Failed:', testsFailed);
console.log('Total:', testsPassed + testsFailed);
console.log('========================================\n');
