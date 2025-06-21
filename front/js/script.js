document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelector('.slides');
  const originalSlides = Array.from(slides.children);

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

  slides.appendChild(firstClone);
  slides.insertBefore(lastClone, slides.firstChild);

  const totalSlides = slides.children.length;
  let currentIndex = 1;

  slides.style.transform = `translateX(-${currentIndex * 100}%)`;

  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  let isTransitioning = false;

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    slides.style.transition = 'transform 0.5s ease-in-out';
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  });

  slides.addEventListener('transitionend', () => {
    if (currentIndex === totalSlides - 1) {
      slides.style.transition = 'none';
      currentIndex = 1;
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (currentIndex === 0) {
      slides.style.transition = 'none';
      currentIndex = totalSlides - 2;
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    isTransitioning = false;
  });
});
