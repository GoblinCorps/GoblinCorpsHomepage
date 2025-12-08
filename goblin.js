/**
 * GoblinCorps Homepage - Interactive Chaos Engine
 * 
 * Features:
 * - Cursor-following goblin companion
 * - CAVE mode (darkens as you scroll deeper)
 * - Dodging links (with accessibility support)
 * - Fake but convincing visitor counter
 * - Chaos-to-order ratio visualization
 * 
 * "We make what we like, because we like making it"
 */

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════
    
    const CONFIG = {
        // Goblin cursor follower
        goblin: {
            size: 30,
            speed: 0.08,
            color: '#2ecc71',
            eyeColor: '#fff',
            pupilColor: '#000'
        },
        // Cave mode
        cave: {
            maxDarkness: 0.7,  // Never goes fully dark (accessibility!)
            startDepth: 0.2     // Start darkening after 20% scroll
        },
        // Dodging links
        dodge: {
            maxDodges: 3,       // Links give up after this many dodges
            dodgeDistance: 60,  // How far they run
            triggerDistance: 80 // How close cursor needs to be
        },
        // Visitor counter
        counter: {
            baseCount: 42069,   // Starting count (nice)
            dailyVariance: 100  // Random daily visitors
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // UTILITY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * Check if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Get a seeded random number for consistent daily values
     */
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // ═══════════════════════════════════════════════════════════════
    // GOBLIN CURSOR FOLLOWER
    // ═══════════════════════════════════════════════════════════════
    
    class GoblinCursor {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.x = window.innerWidth / 2;
            this.y = window.innerHeight / 2;
            this.targetX = this.x;
            this.targetY = this.y;
            this.angle = 0;
            
            this.resize();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        bindEvents() {
            window.addEventListener('resize', () => this.resize());
            
            document.addEventListener('mousemove', (e) => {
                this.targetX = e.clientX;
                this.targetY = e.clientY;
            });

            document.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.targetX = e.touches[0].clientX;
                    this.targetY = e.touches[0].clientY;
                }
            });
        }

        animate() {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Smooth follow
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.x += dx * CONFIG.goblin.speed;
            this.y += dy * CONFIG.goblin.speed;

            // Calculate angle towards cursor
            this.angle = Math.atan2(dy, dx);

            // Draw the goblin!
            this.draw();

            requestAnimationFrame(() => this.animate());
        }

        draw() {
            const ctx = this.ctx;
            const size = CONFIG.goblin.size;
            const x = this.x;
            const y = this.y;

            ctx.save();
            ctx.translate(x, y);

            // Body (round goblin)
            ctx.beginPath();
            ctx.fillStyle = CONFIG.goblin.color;
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();

            // Ears (pointy!)
            ctx.beginPath();
            ctx.moveTo(-size / 3, -size / 4);
            ctx.lineTo(-size / 2 - 8, -size / 2 - 10);
            ctx.lineTo(-size / 6, -size / 3);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(size / 3, -size / 4);
            ctx.lineTo(size / 2 + 8, -size / 2 - 10);
            ctx.lineTo(size / 6, -size / 3);
            ctx.fill();

            // Eyes (looking at cursor)
            const eyeOffsetX = Math.cos(this.angle) * 3;
            const eyeOffsetY = Math.sin(this.angle) * 3;

            // Left eye
            ctx.beginPath();
            ctx.fillStyle = CONFIG.goblin.eyeColor;
            ctx.arc(-6, -3, 6, 0, Math.PI * 2);
            ctx.fill();

            // Right eye
            ctx.beginPath();
            ctx.arc(6, -3, 6, 0, Math.PI * 2);
            ctx.fill();

            // Pupils (follow cursor)
            ctx.fillStyle = CONFIG.goblin.pupilColor;
            ctx.beginPath();
            ctx.arc(-6 + eyeOffsetX, -3 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(6 + eyeOffsetX, -3 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();

            // Mischievous grin
            ctx.beginPath();
            ctx.strokeStyle = CONFIG.goblin.pupilColor;
            ctx.lineWidth = 2;
            ctx.arc(0, 4, 8, 0.2, Math.PI - 0.2);
            ctx.stroke();

            ctx.restore();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CAVE MODE
    // ═══════════════════════════════════════════════════════════════
    
    class CaveMode {
        constructor(overlay) {
            this.overlay = overlay;
            this.bindEvents();
            this.update();
        }

        bindEvents() {
            window.addEventListener('scroll', () => this.update());
            window.addEventListener('resize', () => this.update());
        }

        update() {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            const adjustedPercent = Math.max(0, (scrollPercent - CONFIG.cave.startDepth) / (1 - CONFIG.cave.startDepth));
            const darkness = Math.min(adjustedPercent * CONFIG.cave.maxDarkness, CONFIG.cave.maxDarkness);
            
            this.overlay.style.opacity = darkness;
            this.overlay.style.background = `radial-gradient(ellipse at center top, 
                transparent 0%, 
                rgba(0, 0, 0, ${darkness * 0.5}) 50%,
                rgba(0, 0, 0, ${darkness}) 100%)`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // DODGING LINKS
    // ═══════════════════════════════════════════════════════════════
    
    class DodgingLinks {
        constructor() {
            this.links = document.querySelectorAll('.dodgy-link');
            this.mouseX = 0;
            this.mouseY = 0;
            this.dodgeCounts = new Map();
            
            this.bindEvents();
        }

        bindEvents() {
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.checkLinks();
            });

            // Reset dodge count on successful click
            this.links.forEach(link => {
                link.addEventListener('click', () => {
                    link.classList.add('caught');
                    setTimeout(() => link.classList.remove('caught'), 300);
                });
            });
        }

        checkLinks() {
            this.links.forEach(link => {
                const rect = link.getBoundingClientRect();
                const linkCenterX = rect.left + rect.width / 2;
                const linkCenterY = rect.top + rect.height / 2;
                
                const distance = Math.hypot(
                    this.mouseX - linkCenterX,
                    this.mouseY - linkCenterY
                );

                // Get current dodge count
                const dodgeCount = this.dodgeCounts.get(link) || 0;

                if (distance < CONFIG.dodge.triggerDistance && dodgeCount < CONFIG.dodge.maxDodges) {
                    this.dodge(link, linkCenterX, linkCenterY);
                    this.dodgeCounts.set(link, dodgeCount + 1);
                }
            });
        }

        dodge(link, centerX, centerY) {
            // Calculate escape direction (away from cursor)
            const angle = Math.atan2(centerY - this.mouseY, centerX - this.mouseX);
            
            // Add some randomness
            const randomAngle = angle + (Math.random() - 0.5) * 0.5;
            
            const moveX = Math.cos(randomAngle) * CONFIG.dodge.dodgeDistance;
            const moveY = Math.sin(randomAngle) * CONFIG.dodge.dodgeDistance;

            // Get current transform or default to 0
            const currentTransform = link.style.transform || 'translate(0px, 0px)';
            const match = currentTransform.match(/translate\(([\d.-]+)px,\s*([\d.-]+)px\)/);
            const currentX = match ? parseFloat(match[1]) : 0;
            const currentY = match ? parseFloat(match[2]) : 0;

            // Apply new transform (clamped to reasonable bounds)
            const newX = Math.max(-100, Math.min(100, currentX + moveX));
            const newY = Math.max(-50, Math.min(50, currentY + moveY));
            
            link.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // VISITOR COUNTER
    // ═══════════════════════════════════════════════════════════════
    
    class VisitorCounter {
        constructor(element) {
            this.element = element;
            this.update();
        }

        update() {
            // Generate a "consistent" daily count using date as seed
            const today = new Date();
            const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
            const dailyRandom = seededRandom(daysSinceEpoch);
            
            // Calculate "total visitors"
            const baseVisitors = CONFIG.counter.baseCount;
            const additionalVisitors = Math.floor(daysSinceEpoch * 7.3); // ~7 visitors per day average
            const todayVisitors = Math.floor(dailyRandom * CONFIG.counter.dailyVariance);
            
            const total = baseVisitors + additionalVisitors + todayVisitors;
            
            // Animate the counter
            this.animateCount(total);
        }

        animateCount(target) {
            const duration = 2000;
            const start = 0;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(start + (target - start) * eased);
                
                this.element.textContent = current.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // CHAOS METER (Portfolio items)
    // ═══════════════════════════════════════════════════════════════
    
    class ChaosMeter {
        constructor() {
            this.items = document.querySelectorAll('.portfolio-item');
            this.init();
        }

        init() {
            this.items.forEach(item => {
                const chaos = parseInt(item.dataset.chaos) || 50;
                const order = parseInt(item.dataset.order) || 50;
                const meter = item.querySelector('.chaos-meter');
                
                if (meter) {
                    meter.style.setProperty('--order-percent', `${order}%`);
                    meter.setAttribute('data-label', `Order: ${order}% | Chaos: ${chaos}%`);
                }
            });
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════
    
    function init() {
        // Only initialize interactive features if user doesn't prefer reduced motion
        if (!prefersReducedMotion()) {
            // Goblin cursor
            const canvas = document.getElementById('goblin-canvas');
            if (canvas) {
                new GoblinCursor(canvas);
            }

            // Dodging links
            new DodgingLinks();
        }

        // These are fine for everyone
        const caveOverlay = document.getElementById('cave-overlay');
        if (caveOverlay) {
            new CaveMode(caveOverlay);
        }

        const counterElement = document.getElementById('visitor-count');
        if (counterElement) {
            new VisitorCounter(counterElement);
        }

        new ChaosMeter();

        // Console easter egg
        console.log('%c🦝 GoblinCorps', 'font-size: 24px; color: #2ecc71; font-weight: bold;');
        console.log('%cWe make what we like, because we like making it', 'font-size: 14px; color: #f1c40f; font-style: italic;');
        console.log('%c\nPsst... you found the console. Here\'s a secret: try scrolling all the way down.', 'font-size: 12px; color: #9b59b6;');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
