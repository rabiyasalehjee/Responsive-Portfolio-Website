document.addEventListener('DOMContentLoaded', () => {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let currentIndex = 1; // Start with the middle slide active

    // Calculate slide width dynamically
    const slideWidth = slides[0].offsetWidth;
    const totalWidth = slideWidth * slides.length;

    // Set initial position to center the active (middle) slide
    const initialTranslate = -(slideWidth * currentIndex - (sliderWrapper.parentElement.offsetWidth - slideWidth) / 2);
    sliderWrapper.style.transform = `translateX(${initialTranslate}px)`;
    prevTranslate = initialTranslate;
    currentTranslate = initialTranslate;

    // Update active slide
    function updateActiveSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
    }

    // Mouse events
    sliderWrapper.addEventListener('mousedown', startDragging);
    sliderWrapper.addEventListener('mouseup', stopDragging);
    sliderWrapper.addEventListener('mouseleave', stopDragging);
    sliderWrapper.addEventListener('mousemove', drag);

    // Touch events
    sliderWrapper.addEventListener('touchstart', startDragging);
    sliderWrapper.addEventListener('touchend', stopDragging);
    sliderWrapper.addEventListener('touchmove', drag);

    function startDragging(e) {
        isDragging = true;
        startPos = getPositionX(e);
        sliderWrapper.style.cursor = 'grabbing';
    }

    function stopDragging() {
        if (!isDragging) return;
        isDragging = false;
        sliderWrapper.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        // Determine if we should move to the next/prev slide
        if (movedBy < -50 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        } else if (movedBy > 50 && currentIndex > 0) {
            currentIndex -= 1;
        }

        // Snap to the current slide, centering it
        prevTranslate = -(slideWidth * currentIndex - (sliderWrapper.parentElement.offsetWidth - slideWidth) / 2);
        currentTranslate = prevTranslate;
        sliderWrapper.style.transform = `translateX(${prevTranslate}px)`;
        updateActiveSlide();
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
        sliderWrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }

    // Prevent dragging images individually
    slides.forEach(slide => {
        slide.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Initial active slide setup
    updateActiveSlide();
});