/* =========================================================
   PORTFOLIO — GABRIEL ASSIS
   JavaScript
========================================================= */


/* =========================================================
   REDUCED MOTION
========================================================= */

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   HEADER
========================================================= */

const header = document.querySelector(".header");

function handleHeader() {
    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
}

window.addEventListener("scroll", handleHeader);

handleHeader();


/* =========================================================
   SCROLL REVEAL
========================================================= */

if (!prefersReducedMotion) {

    const revealElements = document.querySelectorAll(
        ".section-header, .project, .about-content, .service, .contact"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });


    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("reveal-visible");

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

}


/* =========================================================
   PROJECT HOVER
========================================================= */

const projects = document.querySelectorAll(".project");

projects.forEach((project) => {

    const image = project.querySelector(".project-placeholder");

    if (!image) return;

    project.addEventListener("mousemove", (event) => {

        if (window.innerWidth <= 900) return;

        const rect = project.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 80;
        const rotateY = (centerX - x) / 80;

        image.style.transform = `
            scale(1.03)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;

    });


    project.addEventListener("mouseleave", () => {

        image.style.transform = "";

    });

});


/* =========================================================
   CUSTOM CURSOR
========================================================= */

if (!prefersReducedMotion && window.innerWidth > 900) {

    const cursor = document.createElement("div");

    cursor.classList.add("custom-cursor");

    document.body.appendChild(cursor);


    document.addEventListener("mousemove", (event) => {

        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

    });


    const interactiveElements = document.querySelectorAll(
        "a, .project, .service"
    );


    interactiveElements.forEach((element) => {

        element.addEventListener("mouseenter", () => {
            cursor.classList.add("cursor-active");
        });

        element.addEventListener("mouseleave", () => {
            cursor.classList.remove("cursor-active");
        });

    });

}


/* =========================================================
   SMOOTH ANCHOR
========================================================= */

const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
);

anchorLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        const targetId = link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#" ||
            targetId.length <= 1
        ) {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: prefersReducedMotion
                ? "auto"
                : "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   CURRENT YEAR
========================================================= */

const footerYear = document.querySelector(".footer p");

if (footerYear) {

    const currentYear = new Date().getFullYear();

    footerYear.textContent = `© ${currentYear} Gabriel Assis`;

}


/* =========================================================
   HERO PARALLAX
========================================================= */

if (!prefersReducedMotion) {

    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    if (hero && heroContent) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > window.innerHeight) {
                return;
            }

            const movement = window.scrollY * 0.15;

            heroContent.style.transform = `
                translateY(${movement}px)
            `;

        });

    }

}


/* =========================================================
   SERVICE HOVER
========================================================= */

const services = document.querySelectorAll(".service");

services.forEach((service) => {

    service.addEventListener("mouseenter", () => {

        service.classList.add("service-active");

    });


    service.addEventListener("mouseleave", () => {

        service.classList.remove("service-active");

    });

});


/* =========================================================
   PAGE LOADED
========================================================= */

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});
