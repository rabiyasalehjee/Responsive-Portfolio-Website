document.addEventListener("DOMContentLoaded", () => {
  
  const lenis = new Lenis({
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(1 - t, 2)), 
    smooth: true, 
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  const leftBtn = document.querySelector('.arrow-left');
  const rightBtn = document.querySelector('.arrow-right');
  const cardSets = document.querySelectorAll('.projects-cards-grid');
  let currentSet = 1;

  rightBtn.addEventListener('click', () => {
    if (currentSet === 1) {
      cardSets[0].classList.remove('active');
      cardSets[1].classList.add('active');
      currentSet = 2;
      leftBtn.removeAttribute('disabled');
      rightBtn.setAttribute('disabled', 'true');
    }
  });

  leftBtn.addEventListener('click', () => {
    if (currentSet === 2) {
      cardSets[1].classList.remove('active');
      cardSets[0].classList.add('active');
      currentSet = 1;
      rightBtn.removeAttribute('disabled');
      leftBtn.setAttribute('disabled', 'true');
    }
  });
  const sliderWrapper = document.querySelector(".slider-wrapper");
  const slides = document.querySelectorAll(".slide");
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let currentIndex = 1;

  const slideWidth = slides[0].offsetWidth;
  const containerWidth = Math.min(sliderWrapper.parentElement.offsetWidth, 1000);
  const visibleSlides = 3;
  const offset = (containerWidth - slideWidth) / 2;

  const initialTranslate = -(slideWidth * currentIndex) + offset;
  sliderWrapper.style.transform = `translateX(${initialTranslate}px)`;
  prevTranslate = initialTranslate;
  currentTranslate = initialTranslate;

  function updateActiveSlide() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === currentIndex);
    });
  }

  sliderWrapper.addEventListener("mousedown", startDragging);
  sliderWrapper.addEventListener("mouseup", stopDragging);
  sliderWrapper.addEventListener("mouseleave", stopDragging);
  sliderWrapper.addEventListener("mousemove", drag);

  sliderWrapper.addEventListener("touchstart", startDragging);
  sliderWrapper.addEventListener("touchend", stopDragging);
  sliderWrapper.addEventListener("touchmove", drag);

  function startDragging(e) {
    isDragging = true;
    startPos = getPositionX(e);
    sliderWrapper.style.cursor = "grabbing";
  }

  function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    sliderWrapper.style.cursor = "grab";

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentIndex < slides.length - 1) {
      currentIndex += 1;
    } else if (movedBy > 50 && currentIndex > 0) {
      currentIndex -= 1;
    }

    prevTranslate = -(slideWidth * currentIndex) + offset;
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
    return e.type.includes("mouse") ? e.pageX : e.touches[0].pageX;
  }

  slides.forEach((slide) => {
    slide.addEventListener("dragstart", (e) => e.preventDefault());
  });

  updateActiveSlide();

  window.addEventListener("resize", () => {
    const newSlideWidth = slides[0].offsetWidth;
    const newContainerWidth = Math.min(sliderWrapper.parentElement.offsetWidth, 1000);
    const newOffset = (newContainerWidth - newSlideWidth) / 2;
    prevTranslate = -(newSlideWidth * currentIndex) + newOffset;
    currentTranslate = prevTranslate;
    sliderWrapper.style.transform = `translateX(${prevTranslate}px)`;
    updateActiveSlide();
  });

  const contactButton = document.querySelector(".contact-button");
  contactButton.addEventListener("click", (e) => {
    e.preventDefault();
    const sliderSection = document.querySelector("#slider");
    smoothScrollTo(sliderSection.offsetTop, 800);
  });

  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    if (startPosition === targetPosition) return;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  const images = document.querySelectorAll("img[loading='lazy']");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src"); 
          }
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "0px 0px 200px 0px", 
    }
  );

  images.forEach((img) => observer.observe(img));

  const serviceGrids = document.querySelectorAll('.service-details-grid');
    
  
  serviceGrids.forEach((grid, index) => {
    if (index !== 0) {
      grid.classList.add('collapsed');
    } else {
      grid.classList.add('expanded');
    }
  });

  
  const buttons = document.querySelectorAll('.service-details-right .contact-button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const currentGrid = button.closest('.service-details-grid');
      const isCollapsed = currentGrid.classList.contains('collapsed');

      
      serviceGrids.forEach(grid => {
        grid.classList.remove('expanded');
        grid.classList.add('collapsed');
      });

      
      if (isCollapsed) {
        currentGrid.classList.remove('collapsed');
        currentGrid.classList.add('expanded');
        
        
        const offsetTop = currentGrid.getBoundingClientRect().top + window.pageYOffset - 100; 
        smoothScrollTo(offsetTop, 300); 
      }
    });
  });
});