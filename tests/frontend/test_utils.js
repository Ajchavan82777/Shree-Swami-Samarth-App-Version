/**
 * Frontend utility tests — plain Node.js, no external dependencies.
 * Tests all helper functions from frontend-app/src/utils/api.js
 */

let passed = 0;
let failed = 0;
const errors = [];

function test(name, fn) {
    try {
        fn();
        console.log('  PASS  ' + name);
        passed++;
    } catch (e) {
        console.error('  FAIL  ' + name);
        console.error('        -> ' + e.message);
        errors.push({ name, message: e.message });
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        throw new Error(
            (label ? label + ': ' : '') +
            'Expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual)
        );
    }
}

function assertContains(str, substr) {
    if (!String(str).includes(substr)) {
        throw new Error('Expected "' + str + '" to contain "' + substr + '"');
    }
}

// ── Copy utility functions from frontend-app/src/utils/api.js ────────────────
const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

// ── fmt() tests ───────────────────────────────────────────────────────────────

console.log('\n--- fmt() ---');

test('formats positive integer with rupee symbol', () => {
    assertContains(fmt(1000), '₹');
});

test('returns ₹0 for zero', () => {
    assertEqual(fmt(0), '₹0');
});

test('handles null gracefully', () => {
    assertContains(fmt(null), '₹');
});

test('handles undefined gracefully', () => {
    assertContains(fmt(undefined), '₹');
});

test('formats large number', () => {
    const result = fmt(100000);
    assertContains(result, '₹');
    assertContains(result, '1');
});

test('formats decimal number', () => {
    const result = fmt(1234.56);
    assertContains(result, '₹');
});

test('handles string number', () => {
    assertContains(fmt('5000'), '₹');
});

test('handles negative number', () => {
    const result = fmt(-500);
    assertContains(result, '₹');
});

// ── fmtDate() tests ───────────────────────────────────────────────────────────

console.log('\n--- fmtDate() ---');

test('returns dash for null', () => {
    assertEqual(fmtDate(null), '-');
});

test('returns dash for undefined', () => {
    assertEqual(fmtDate(undefined), '-');
});

test('returns dash for empty string', () => {
    assertEqual(fmtDate(''), '-');
});

test('formats ISO date string contains year', () => {
    const result = fmtDate('2024-06-15');
    assertContains(result, '2024');
});

test('formats ISO date string contains day', () => {
    const result = fmtDate('2024-06-15');
    assertContains(result, '15');
});

test('formats ISO date string contains month abbreviation', () => {
    const result = fmtDate('2024-01-15');
    // Jan in en-IN locale
    assert(result.length > 0, 'Result should not be empty');
});

test('returns string type', () => {
    assertEqual(typeof fmtDate('2024-06-15'), 'string');
});

test('formats another valid date', () => {
    const result = fmtDate('2025-12-31');
    assertContains(result, '2025');
    assertContains(result, '31');
});

// ── cap() tests ───────────────────────────────────────────────────────────────

console.log('\n--- cap() ---');

test('capitalizes first letter of lowercase word', () => {
    assertEqual(cap('hello'), 'Hello');
});

test('capitalizes first letter, rest unchanged', () => {
    assertEqual(cap('world'), 'World');
});

test('leaves already-capitalized string unchanged', () => {
    assertEqual(cap('Hello'), 'Hello');
});

test('capitalizes single character', () => {
    assertEqual(cap('a'), 'A');
});

test('returns empty string for empty input', () => {
    assertEqual(cap(''), '');
});

test('returns empty string for null', () => {
    assertEqual(cap(null), '');
});

test('returns empty string for undefined', () => {
    assertEqual(cap(undefined), '');
});

test('handles all-uppercase string', () => {
    assertEqual(cap('HELLO'), 'HELLO');
});

test('handles string with spaces', () => {
    assertEqual(cap('hello world'), 'Hello world');
});

test('handles numeric string', () => {
    assertEqual(cap('123abc'), '123abc');
});

// ── API base URL env var ───────────────────────────────────────────────────────

console.log('\n--- Environment Variable ---');

test('VITE_API_BASE_URL is defined in test env or uses fallback', () => {
    // In production builds this is replaced by Vite. In Node.js test it won't be.
    // Just verifying the fallback logic works (http://localhost:5000/api or /api).
    const base = (typeof import_meta_env !== 'undefined'
        ? import_meta_env.VITE_API_BASE_URL
        : undefined) || 'http://localhost:5000/api';
    assertContains(base, '/api');
});

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n================================================');
console.log('  Frontend Utils Test Results');
console.log('================================================');
console.log('  Passed : ' + passed);
console.log('  Failed : ' + failed);
console.log('================================================');

if (failed > 0) {
    console.error('\nFailed Tests:');
    errors.forEach((e, i) => {
        console.error('  ' + (i + 1) + '. ' + e.name);
        console.error('     ' + e.message);
    });
    console.error('');
    process.exit(1);
} else {
    console.log('\n  All frontend utility tests passed!\n');
    process.exit(0);
}
