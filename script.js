/* =============================================
   🎂 BIRTHDAY WEBSITE — INTERACTIVE SCRIPT
   =============================================
   
   ✏️ CUSTOMIZE EVERYTHING BELOW!
   Change the name, qualities, photos, and wish
   to make this page perfect for your friend.
   ============================================= */

// ===== 🎯 CONFIGURATION — EDIT THESE! =====

const CONFIG = {
    // Your friend's name
    name: "Dear Friend",

    // Qualities / nice things about your friend (front: what shows, back: the detail)
    qualities: [
        {
            emoji: "💖",
            title: "Kind Heart",
            back: "You always know how to make everyone feel loved and cared for. Your kindness lights up every room you walk into."
        },
        {
            emoji: "😂",
            title: "Amazing Humor",
            back: "Your laugh is contagious! You can turn any bad day into the best day just by being yourself."
        },
        {
            emoji: "🌟",
            title: "Inspiring Soul",
            back: "You inspire everyone around you to be their best selves. Your determination is truly admirable."
        },
        {
            emoji: "🤝",
            title: "Loyal Friend",
            back: "Through thick and thin, you've always been there. A friend like you is one in a million."
        },
        {
            emoji: "🧠",
            title: "Brilliant Mind",
            back: "Your intelligence and creativity never cease to amaze us. You see solutions where others see problems."
        },
        {
            emoji: "🎨",
            title: "Creative Spirit",
            back: "You bring color and beauty to everything you touch. Your creativity knows no bounds!"
        }
    ],

    // Photos — Replace these with real photo paths!
    // Put your photos in a 'photos' folder next to this file
    // Example: { src: "photos/pic1.jpg", caption: "That amazing trip!" }
    photos: [
        { src: "", caption: "Add your favorite memory here 📸", placeholder: true },
        { src: "", caption: "That unforgettable moment ✨", placeholder: true },
        { src: "", caption: "Best day ever! 🎉", placeholder: true },
        { src: "", caption: "Friends forever 💕", placeholder: true },
        { src: "", caption: "Making memories 🌈", placeholder: true },
        { src: "", caption: "Living our best life 🥳", placeholder: true }
    ],

    // Birthday wish message (the typing animation text)
    wish: "On this special day, I just want you to know how incredibly grateful I am to have you in my life. You make the world a better, brighter, and more beautiful place just by being in it. May this year bring you endless joy, adventures, laughter, and all the love your wonderful heart deserves. Here's to another amazing year of being YOU! 🎂💖✨",

    // Signature line under the wish
    signature: "— With all my love ❤️",

    // Active theme
    theme: "default"
};

let currentStepIndex = 0;
let steps = [];

// ===== 🚀 INITIALIZATION =====

document.addEventListener("DOMContentLoaded", () => {
    loadConfigFromURL();
    applyTheme();
    
    setName();
    renderQualities();
    renderGallery();
    createHeroParticles();
    
    // Instead of scrolling, we use tap-to-advance
    initTapToAdvance();
    // initScrollAnimations(); // We will trigger animations per step instead
    // initSmoothScroll(); // Not needed for tap-to-advance
    
    initTypingEffect();
    initCakeInteraction();
    initLightbox();
    initCustomizer();
});

// ===== ⚙️ URL CONFIG & THEMES =====

function loadConfigFromURL() {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
        try {
            const decoded = atob(decodeURIComponent(data));
            const parsedInfo = JSON.parse(decoded);
            Object.assign(CONFIG, parsedInfo);
        } catch (e) {
            console.error("Failed to parse config from URL", e);
        }
    }
}

function applyTheme() {
    document.documentElement.className = '';
    if (CONFIG.theme && CONFIG.theme !== 'default') {
        document.documentElement.classList.add(CONFIG.theme);
    }
}

// ===== 👣 TAP TO ADVANCE =====

function initTapToAdvance() {
    steps = Array.from(document.querySelectorAll('.step'));
    
    // Set initial state
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
            triggerStepAnimations(step);
        } else {
            step.classList.remove('active');
        }
    });

    document.addEventListener('click', (e) => {
        // Prevent advance if clicking on interactive elements
        if (e.target.closest('button') || 
            e.target.closest('a') || 
            e.target.closest('.gallery-item') || 
            e.target.closest('.lightbox') ||
            e.target.closest('.customizer-modal')) {
            return;
        }

        advanceStep();
    });
}

function advanceStep() {
    if (currentStepIndex >= steps.length - 1) return; // At end
    
    const currentStep = steps[currentStepIndex];
    currentStep.classList.remove('active');
    
    currentStepIndex++;
    
    const nextStep = steps[currentStepIndex];
    nextStep.classList.add('active');
    triggerStepAnimations(nextStep);
}

function triggerStepAnimations(step) {
    // Animate inner elements that were previously triggered by scroll
    const animatables = step.querySelectorAll('.quality-card, .gallery-item');
    animatables.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
        }, index * 100);
    });

    const hiddens = step.querySelectorAll('.hidden:not(#celebration-message)');
    hiddens.forEach(el => el.classList.add('show'));

    // Trigger typing effect if it's the wishes section
    if (step.id === 'wishes') {
        const wishContainer = document.getElementById("wishes-text");
        if (wishContainer && !wishContainer.classList.contains('typed')) {
            wishContainer.classList.add('typed');
            typeText(wishContainer, CONFIG.wish);
        }
    }
}

// ===== 📛 SET NAME =====

function setName() {
    const heroName = document.getElementById("hero-name");
    if (heroName) heroName.textContent = CONFIG.name;

    // Also update the signature
    const sig = document.getElementById("wishes-signature");
    if (sig) sig.textContent = CONFIG.signature;
}

// ===== 💛 RENDER QUALITIES =====

function renderQualities() {
    const grid = document.getElementById("qualities-grid");
    if (!grid) return;

    CONFIG.qualities.forEach((q, i) => {
        const card = document.createElement("div");
        card.className = "quality-card";
        card.style.transitionDelay = `${i * 0.1}s`;
        card.innerHTML = `
            <div class="quality-card-inner">
                <div class="quality-card-front">
                    <div class="quality-emoji">${q.emoji}</div>
                    <h3 class="quality-title">${q.title}</h3>
                    <p class="quality-hint">Hover to reveal ✨</p>
                </div>
                <div class="quality-card-back">
                    <p class="quality-back-text">"${q.back}"</p>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== 📸 RENDER GALLERY =====

function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    CONFIG.photos.forEach((photo, i) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.style.transitionDelay = `${i * 0.1}s`;

        if (photo.placeholder || !photo.src) {
            const emojis = ["📷", "🖼️", "📸", "🎞️", "🌄", "🎠"];
            item.innerHTML = `
                <div class="gallery-placeholder">
                    <span class="gallery-placeholder-emoji">${emojis[i % emojis.length]}</span>
                    <span class="gallery-placeholder-text">${photo.caption}</span>
                </div>
                <div class="gallery-caption">
                    <p>${photo.caption}</p>
                </div>
            `;
        } else {
            item.innerHTML = `
                <img src="${photo.src}" alt="${photo.caption}" loading="lazy">
                <div class="gallery-caption">
                    <p>${photo.caption}</p>
                </div>
            `;
            item.dataset.src = photo.src;
            item.dataset.caption = photo.caption;
        }

        grid.appendChild(item);
    });
}

// ===== 🌟 HERO PARTICLES =====

function createHeroParticles() {
    const container = document.getElementById("hero-particles");
    if (!container) return;

    const colors = [
        "rgba(168, 85, 247, 0.6)",
        "rgba(236, 72, 153, 0.6)",
        "rgba(245, 158, 11, 0.6)",
        "rgba(251, 191, 36, 0.5)",
        "rgba(192, 132, 252, 0.5)"
    ];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        const size = Math.random() * 6 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.background}`;
        container.appendChild(particle);
    }
}

// ===== 📜 SCROLL ANIMATIONS =====

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate-in");
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
    });

    // Observe quality cards
    document.querySelectorAll(".quality-card").forEach(card => observer.observe(card));

    // Observe gallery items
    document.querySelectorAll(".gallery-item").forEach(item => observer.observe(item));

    // Observe generic hidden elements
    document.querySelectorAll(".hidden").forEach(el => {
        const showObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        }, { threshold: 0.2 });
        showObserver.observe(el);
    });
}

// ===== ✍️ TYPING EFFECT =====

function initTypingEffect() {
    // Note: Typing is now triggered by triggerStepAnimations() when the step becomes active
}

function typeText(container, text) {
    container.innerHTML = '<span class="wishes-cursor"></span>';
    let i = 0;
    const speed = 30; // ms per character

    function type() {
        if (i < text.length) {
            const cursor = container.querySelector('.wishes-cursor');
            const textNode = document.createTextNode(text.charAt(i));
            container.insertBefore(textNode, cursor);
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor and show signature
            const cursor = container.querySelector('.wishes-cursor');
            if (cursor) {
                setTimeout(() => {
                    cursor.remove();
                    const sig = document.getElementById("wishes-signature");
                    if (sig) sig.classList.add("show");
                }, 1500);
            }
        }
    }

    type();
}

// ===== 🎂 CAKE / BLOW CANDLES =====

function initCakeInteraction() {
    const blowBtn = document.getElementById("blow-btn");
    if (!blowBtn) return;

    blowBtn.addEventListener("click", () => {
        // Blow out flames
        document.querySelectorAll(".flame").forEach((flame, i) => {
            setTimeout(() => {
                flame.classList.add("out");
            }, i * 200);
        });

        // Change button
        setTimeout(() => {
            blowBtn.innerHTML = "🎉 Candles Blown!";
            blowBtn.classList.add("blown");

            // Show celebration message
            const msg = document.getElementById("celebration-message");
            if (msg) {
                msg.classList.remove("hidden");
                msg.classList.add("show");
            }

            // Fire confetti!
            launchConfetti();
        }, 700);
    });
}

// ===== 🎊 CONFETTI ENGINE =====

function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = [
        "#a855f7", "#c084fc", "#f59e0b", "#fbbf24",
        "#ec4899", "#f472b6", "#6366f1", "#818cf8",
        "#22c55e", "#ef4444", "#3b82f6", "#f97316"
    ];

    // Create confetti pieces
    for (let i = 0; i < 250; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 12 + 5,
            h: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            velocityX: (Math.random() - 0.5) * 6,
            velocityY: Math.random() * 4 + 2,
            oscillation: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.05 + 0.02
        });
    }

    let frame = 0;
    const maxFrames = 300;

    function animateConfetti() {
        if (frame > maxFrames) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const fadeAlpha = frame > maxFrames - 60 ? (maxFrames - frame) / 60 : 1;
        ctx.globalAlpha = fadeAlpha;

        confettiPieces.forEach(p => {
            p.x += p.velocityX + Math.sin(p.oscillation) * 1.5;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;
            p.oscillation += p.oscillationSpeed;
            p.velocityY += 0.03; // gravity

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        requestAnimationFrame(animateConfetti);
    }

    animateConfetti();

    // Also launch a second burst after a delay
    setTimeout(() => {
        frame = 0;
        confettiPieces.forEach(p => {
            p.x = Math.random() * canvas.width;
            p.y = -20 - Math.random() * 200;
            p.velocityY = Math.random() * 3 + 1;
            p.velocityX = (Math.random() - 0.5) * 8;
        });
        animateConfetti();
    }, 1500);
}

// ===== 🖼️ LIGHTBOX =====

function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxClose = document.getElementById("lightbox-close");
    if (!lightbox || !lightboxImg || !lightboxClose) return;

    document.addEventListener("click", (e) => {
        const item = e.target.closest(".gallery-item");
        if (item && item.dataset.src) {
            lightboxImg.src = item.dataset.src;
            lightboxCaption.textContent = item.dataset.caption || "";
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    });

    const closeLightbox = () => {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
}

// ===== 🔗 CUSTOMIZER MODAL =====

function initCustomizer() {
    const modal = document.getElementById('customizer-modal');
    const btn = document.getElementById('customizer-btn');
    const closeBtn = document.getElementById('customizer-close');
    const generateBtn = document.getElementById('generate-btn');
    const linkContainer = document.getElementById('share-link-container');
    const linkInput = document.getElementById('share-link-input');
    const copyBtn = document.getElementById('copy-link-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    
    if (!modal || !btn) return;

    // Open modal
    btn.addEventListener('click', () => {
        document.getElementById('edit-name').value = CONFIG.name;
        document.getElementById('edit-quote').value = CONFIG.wish;
        
        // Set active theme button
        themeBtns.forEach(b => {
            b.classList.toggle('active', b.dataset.theme === (CONFIG.theme || 'default'));
        });
        
        modal.classList.add('active');
        linkContainer.classList.add('hidden');
    });

    // Close modal
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));

    // Select theme
    let selectedTheme = CONFIG.theme || 'default';
    themeBtns.forEach(tBtn => {
        tBtn.addEventListener('click', (e) => {
            themeBtns.forEach(b => b.classList.remove('active'));
            const target = e.currentTarget;
            target.classList.add('active');
            selectedTheme = target.dataset.theme;
        });
    });

    // Generate link
    generateBtn.addEventListener('click', () => {
        const newName = document.getElementById('edit-name').value.trim() || CONFIG.name;
        const newWish = document.getElementById('edit-quote').value.trim() || CONFIG.wish;

        const newConfig = {
            name: newName,
            wish: newWish,
            theme: selectedTheme
        };

        const configStr = JSON.stringify(newConfig);
        const encoded = encodeURIComponent(btoa(configStr));
        
        const url = new URL(window.location.href);
        url.searchParams.set('data', encoded);
        
        linkInput.value = url.toString();
        linkContainer.classList.remove('hidden');
    });

    // Copy link
    copyBtn.addEventListener('click', () => {
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy', 2000);
    });
}

// ===== 📐 RESIZE HANDLER =====

window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
