/* script.js — Floating Layer Gallery */
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeLightboxBtn = document.getElementById('closeLightbox');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentImageIndex = 0;
    let visibleItems = Array.from(galleryItems);

    /* ── Scroll-driven entrance animation ── */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15,
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the animation for each card
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, i * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    galleryItems.forEach(item => {
        item.style.opacity = '0';
        revealObserver.observe(item);
    });

    /* ── Explore button smooth scroll ── */
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            const gallery = document.querySelector('.gallery-container');
            if (gallery) {
                gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* ── Filtering logic ── */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            visibleItems = [];

            galleryItems.forEach((item, index) => {
                item.classList.remove('fade-in');
                item.style.opacity = '0';

                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // Stagger the re-entrance
                    setTimeout(() => {
                        item.classList.add('fade-in');
                        item.style.opacity = '';
                    }, index * 100);
                    visibleItems.push(item);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ── Lightbox logic ── */
    galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
            currentImageIndex = visibleItems.indexOf(item);
            if (currentImageIndex !== -1) {
                openLightbox(item);
            }
        });
    });

    function openLightbox(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.overlay span');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 500);
    }

    closeLightboxBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    /* ── Navigation ── */
    function showNextImage() {
        if (visibleItems.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % visibleItems.length;
        openLightbox(visibleItems[currentImageIndex]);
    }

    function showPrevImage() {
        if (visibleItems.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(visibleItems[currentImageIndex]);
    }

    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
});
