/* ==========================================
   SCRIPT.JS — Pelindo Brew Fest 2026
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Elements
    const topBtn = document.getElementById("topBtn");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll(".section");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navLinks");

    // 2. Mobile Nav Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // Close mobile menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
        });
    });

    // 3. Back To Top Button
    if (topBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                topBtn.style.display = "block";
            } else {
                topBtn.style.display = "none";
            }
        });

        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // 4. Fade In Animation (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });

    }, {
        threshold: 0.15
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // 5. Tenant Detail Modal (Popup Carousel — bisa banyak item, discroll/geser)
    const tenantButtons = document.querySelectorAll(".tenant-count-btn");
    const tenantModalOverlay = document.getElementById("tenantModalOverlay");
    const tenantModalClose = document.getElementById("tenantModalClose");
    const tenantModalPrev = document.getElementById("tenantModalPrev");
    const tenantModalNext = document.getElementById("tenantModalNext");
    const tenantModalTrack = document.getElementById("tenantModalTrack");
    const tenantModalDots = document.getElementById("tenantModalDots");

    let currentSlideIndex = 0;
    let totalSlides = 0;

    function updateActiveDot(index) {
        tenantModalDots.querySelectorAll("button").forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });
    }

    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlideIndex = index;
        const slideWidth = tenantModalTrack.clientWidth;
        tenantModalTrack.scrollTo({ left: slideWidth * index, behavior: "smooth" });
        updateActiveDot(index);
    }

    function openTenantModal(btn) {
        const modalId = btn.dataset.modalTarget;
        // Ambil data slide dari <template data-modal-id="...">
        const template = document.querySelector(`template[data-modal-id="${modalId}"]`);
        if (!template) return;

        // Kosongkan track & dots dulu, lalu isi ulang dari template
        tenantModalTrack.innerHTML = "";
        tenantModalDots.innerHTML = "";
        tenantModalTrack.appendChild(template.content.cloneNode(true));

        const slides = tenantModalTrack.querySelectorAll(".tenant-slide");
        totalSlides = slides.length;
        currentSlideIndex = 0;

        // Bikin dots sesuai jumlah item
        slides.forEach((slide, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", `Item ${index + 1}`);
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(index));
            tenantModalDots.appendChild(dot);
        });

        // Panah & dots disembunyikan kalau cuma 1 item
        const multipleItems = totalSlides > 1;
        tenantModalPrev.classList.toggle("is-hidden", !multipleItems);
        tenantModalNext.classList.toggle("is-hidden", !multipleItems);
        tenantModalDots.style.display = multipleItems ? "flex" : "none";

        tenantModalOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Pastikan posisi scroll balik ke item pertama
        requestAnimationFrame(() => {
            tenantModalTrack.scrollLeft = 0;
        });
    }

    function closeTenantModal() {
        tenantModalOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (tenantModalOverlay && tenantModalClose && tenantModalTrack) {
        tenantButtons.forEach(btn => {
            btn.addEventListener("click", () => openTenantModal(btn));
        });

        tenantModalClose.addEventListener("click", closeTenantModal);

        tenantModalPrev.addEventListener("click", () => goToSlide(currentSlideIndex - 1));
        tenantModalNext.addEventListener("click", () => goToSlide(currentSlideIndex + 1));

        // Update dots aktif kalau user geser/scroll manual (swipe di HP, trackpad, dll)
        let scrollTimeout;
        tenantModalTrack.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const slideWidth = tenantModalTrack.clientWidth || 1;
                const index = Math.round(tenantModalTrack.scrollLeft / slideWidth);
                currentSlideIndex = index;
                updateActiveDot(index);
            }, 100);
        });

        // Klik di luar box modal (di area overlay gelap) untuk menutup
        tenantModalOverlay.addEventListener("click", (e) => {
            if (e.target === tenantModalOverlay) {
                closeTenantModal();
            }
        });

        // Navigasi keyboard: Esc untuk tutup, panah kiri/kanan untuk pindah item
        document.addEventListener("keydown", (e) => {
            if (!tenantModalOverlay.classList.contains("active")) return;
            if (e.key === "Escape") closeTenantModal();
            if (e.key === "ArrowLeft") goToSlide(currentSlideIndex - 1);
            if (e.key === "ArrowRight") goToSlide(currentSlideIndex + 1);
        });
    }

    // 6. Active Link Highlight on Scroll
    window.addEventListener("scroll", () => {

        let currentSection = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });

    });

});s