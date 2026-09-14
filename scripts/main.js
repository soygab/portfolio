document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const header = document.querySelector(".header");
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
const sections = [...document.querySelectorAll("main section[id]")];

function setDelay(element, index, step = 90) {
    element.style.setProperty("--delay", `${index * step}ms`);
}

// Abertura do hero em sequência, sem depender de bibliotecas externas.
const heroItems = [
    ...document.querySelectorAll(".hero-content > *"),
    document.querySelector(".hero-bottom")
].filter(Boolean);

heroItems.forEach((item, index) => {
    item.classList.add("hero-reveal");
    setDelay(item, index, 110);
});

requestAnimationFrame(() => {
    requestAnimationFrame(() => heroItems.forEach(item => item.classList.add("is-visible")));
});

// Entradas suaves conforme os blocos aparecem no viewport.
const revealGroups = [
    [".section-header", 0],
    [".project", 0],
    [".about-title", 0],
    [".about-text p", 85],
    [".service", 75],
    [".contact > *", 85],
    [".footer > *", 75]
];

const revealItems = [];
revealGroups.forEach(([selector, step]) => {
    document.querySelectorAll(selector).forEach((item, index) => {
        item.classList.add("scroll-reveal");
        setDelay(item, index, step);
        revealItems.push(item);
    });
});

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

    revealItems.forEach(item => revealObserver.observe(item));
}

// Barra de progresso, cabeçalho compacto e item ativo da navegação.
let scrollTicking = false;

function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    header?.style.setProperty("--scroll-progress", progress.toFixed(4));
    header?.classList.toggle("is-scrolled", window.scrollY > 48);

    const marker = window.scrollY + window.innerHeight * 0.38;
    let activeId = "";
    sections.forEach(section => {
        if (marker >= section.offsetTop) activeId = section.id;
    });

    navLinks.forEach(link => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });

    scrollTicking = false;
}

window.addEventListener("scroll", () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScrollUI);
}, { passive: true });

updateScrollUI();

// Luz ambiente e paralaxe muito leve nas capas dos projetos.
if (!prefersReducedMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "ambient-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);

    let pointerX = -500;
    let pointerY = -500;
    let pointerFrame = 0;

    window.addEventListener("pointermove", event => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        document.documentElement.style.setProperty("--mouse-x", `${(pointerX / window.innerWidth) * 100}%`);
        document.documentElement.style.setProperty("--mouse-y", `${(pointerY / window.innerHeight) * 100}%`);

        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
            glow.style.setProperty("--cursor-x", `${pointerX}px`);
            glow.style.setProperty("--cursor-y", `${pointerY}px`);
            pointerFrame = 0;
        });
    }, { passive: true });

    document.querySelectorAll(".project-image").forEach(image => {
        image.addEventListener("pointermove", event => {
            const bounds = image.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            image.style.setProperty("--image-x", `${x * 8}px`);
            image.style.setProperty("--image-y", `${y * 8}px`);
        }, { passive: true });

        image.addEventListener("pointerleave", () => {
            image.style.removeProperty("--image-x");
            image.style.removeProperty("--image-y");
        });
    });
}
