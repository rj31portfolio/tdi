document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetSelector = anchor.getAttribute("href");
        const target = targetSelector ? document.querySelector(targetSelector) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

const animatedElements = document.querySelectorAll(
    ".feature-box, .stat-box, .card, #about-sec .img-box, #about-sec .right, .partner-sec .img-box, .contact-sec .left, .hero-section .hero-content"
);

if (animatedElements.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -40px 0px"
    });

    animatedElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    animatedElements.forEach((element) => {
        element.classList.add("animate-in");
    });
}

const statsSection = document.querySelector(".stats-section");

function formatCounterValue(target) {
    if (target >= 1000) {
        return `${Math.round(target / 100) / 10}K+`;
    }

    return `${target}+`;
}

function animateCounters() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach((counter) => {
        if (counter.dataset.animated === "true") {
            return;
        }

        counter.dataset.animated = "true";
        const target = Number(counter.getAttribute("data-target")) || 0;
        const duration = 1400;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.round(target * easedProgress);

            if (progress < 1) {
                counter.innerText = currentValue.toLocaleString();
                requestAnimationFrame(updateCounter);
                return;
            }

            counter.innerText = formatCounterValue(target);
        };

        requestAnimationFrame(updateCounter);
    });
}

if (statsSection && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounters();
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.35
    });

    statsObserver.observe(statsSection);
} else if (statsSection) {
    animateCounters();
}

const header = document.querySelector("#header");

if (header) {
    const updateHeaderState = () => {
        if (window.scrollY > 40) {
            header.classList.add("is-scrolled");
        } else {
            header.classList.remove("is-scrolled");
        }
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
}
