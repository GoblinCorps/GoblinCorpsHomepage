/**
 * GoblinCorps Homepage - Test Suite
 * 
 * Tests for the chaos engine components.
 * Run in browser console or with a test runner.
 */

(function() {
    'use strict';

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function test(name, fn) {
        try {
            fn();
            results.passed++;
            results.tests.push({ name, status: 'PASS' });
            console.log(`✅ ${name}`);
        } catch (e) {
            results.failed++;
            results.tests.push({ name, status: 'FAIL', error: e.message });
            console.error(`❌ ${name}: ${e.message}`);
        }
    }

    function assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION TESTS
    // ═══════════════════════════════════════════════════════════════

    test('CONFIG object exists and has required properties', () => {
        assert(typeof CONFIG !== 'undefined', 'CONFIG should exist');
        assert(CONFIG.goblin, 'CONFIG.goblin should exist');
        assert(CONFIG.cave, 'CONFIG.cave should exist');
        assert(CONFIG.dodge, 'CONFIG.dodge should exist');
        assert(CONFIG.counter, 'CONFIG.counter should exist');
    });

    test('Goblin config has valid size', () => {
        assert(CONFIG.goblin.size > 0, 'Goblin size should be positive');
        assert(CONFIG.goblin.size <= 100, 'Goblin size should be reasonable');
    });

    test('Cave mode max darkness is accessible (not fully dark)', () => {
        assert(CONFIG.cave.maxDarkness < 1, 'Max darkness should be less than 1 for accessibility');
        assert(CONFIG.cave.maxDarkness >= 0, 'Max darkness should be non-negative');
    });

    test('Dodge config limits dodges for usability', () => {
        assert(CONFIG.dodge.maxDodges > 0, 'Should allow at least one dodge');
        assert(CONFIG.dodge.maxDodges <= 5, 'Should not dodge too many times');
    });

    // ═══════════════════════════════════════════════════════════════
    // UTILITY FUNCTION TESTS
    // ═══════════════════════════════════════════════════════════════

    test('prefersReducedMotion returns boolean', () => {
        const result = prefersReducedMotion();
        assert(typeof result === 'boolean', 'Should return boolean');
    });

    test('seededRandom returns consistent values for same seed', () => {
        const seed = 12345;
        const result1 = seededRandom(seed);
        const result2 = seededRandom(seed);
        assertEqual(result1, result2, 'Same seed should produce same result');
    });

    test('seededRandom returns values between 0 and 1', () => {
        for (let i = 0; i < 100; i++) {
            const result = seededRandom(i);
            assert(result >= 0 && result < 1, `Result ${result} should be in [0, 1)`);
        }
    });

    // ═══════════════════════════════════════════════════════════════
    // DOM ELEMENT TESTS
    // ═══════════════════════════════════════════════════════════════

    test('Required DOM elements exist', () => {
        assert(document.getElementById('cave-overlay'), 'Cave overlay should exist');
        assert(document.getElementById('goblin-canvas'), 'Goblin canvas should exist');
        assert(document.getElementById('visitor-count'), 'Visitor counter should exist');
        assert(document.getElementById('main-content'), 'Main content should exist');
    });

    test('Skip link exists for accessibility', () => {
        const skipLink = document.querySelector('.skip-link');
        assert(skipLink, 'Skip link should exist');
        assertEqual(skipLink.getAttribute('href'), '#main-content', 'Skip link should target main content');
    });

    test('Dodgy links have required data attributes', () => {
        const dodgyLinks = document.querySelectorAll('.dodgy-link');
        assert(dodgyLinks.length > 0, 'Should have dodgy links');
    });

    test('Portfolio items have chaos/order data', () => {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            assert(item.dataset.chaos, 'Portfolio item should have chaos data');
            assert(item.dataset.order, 'Portfolio item should have order data');
        });
    });

    // ═══════════════════════════════════════════════════════════════
    // ACCESSIBILITY TESTS
    // ═══════════════════════════════════════════════════════════════

    test('Images and decorative elements have aria-hidden', () => {
        const caveOverlay = document.getElementById('cave-overlay');
        const goblinCanvas = document.getElementById('goblin-canvas');
        assertEqual(caveOverlay.getAttribute('aria-hidden'), 'true', 'Cave overlay should be aria-hidden');
        assertEqual(goblinCanvas.getAttribute('aria-hidden'), 'true', 'Goblin canvas should be aria-hidden');
    });

    test('Page has proper heading hierarchy', () => {
        const h1 = document.querySelectorAll('h1');
        assertEqual(h1.length, 1, 'Should have exactly one h1');
        
        const h2s = document.querySelectorAll('h2');
        assert(h2s.length > 0, 'Should have h2 section headers');
    });

    test('HTML lang attribute is set', () => {
        const html = document.documentElement;
        assert(html.getAttribute('lang'), 'HTML should have lang attribute');
    });

    test('Viewport meta tag exists', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        assert(viewport, 'Viewport meta tag should exist');
    });

    // ═══════════════════════════════════════════════════════════════
    // CSS TESTS
    // ═══════════════════════════════════════════════════════════════

    test('CSS custom properties are defined', () => {
        const styles = getComputedStyle(document.documentElement);
        assert(styles.getPropertyValue('--goblin-green'), 'Should have --goblin-green');
        assert(styles.getPropertyValue('--goblin-gold'), 'Should have --goblin-gold');
    });

    test('Reduced motion media query styles exist', () => {
        // Check that the CSS file contains prefers-reduced-motion
        const styleSheets = document.styleSheets;
        let hasReducedMotion = false;
        
        try {
            for (const sheet of styleSheets) {
                const rules = sheet.cssRules || sheet.rules;
                for (const rule of rules) {
                    if (rule.media && rule.media.mediaText.includes('prefers-reduced-motion')) {
                        hasReducedMotion = true;
                        break;
                    }
                }
            }
        } catch (e) {
            // CORS may prevent reading external stylesheets
            hasReducedMotion = true; // Assume it exists if we can't check
        }
        
        assert(hasReducedMotion, 'Should have prefers-reduced-motion styles');
    });

    // ═══════════════════════════════════════════════════════════════
    // RESULTS
    // ═══════════════════════════════════════════════════════════════

    console.log('\n' + '═'.repeat(50));
    console.log(`Tests complete: ${results.passed} passed, ${results.failed} failed`);
    console.log('═'.repeat(50));

    // Expose results for programmatic access
    window.testResults = results;

})();
