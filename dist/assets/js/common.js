// * =============== cursor ===============v *//
function cursorFunc() {
  const cursor = document.getElementById('cursor');

  if (!cursor) return;

  // 실제 마우스 좌표
  let mouseX = 0;
  let mouseY = 0;

  // 커서 위치 (부드럽게 이동할 좌표)
  let cursorX = 0;
  let cursorY = 0;

  const speed = 0.1;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// * =============== split text ===============v *//
function splitTextEffect() {
  document.querySelectorAll('.card').forEach((card) => {
    const title = new SplitText(card.querySelector('.tit strong'), { type: 'chars' });
    const text = new SplitText(card.querySelector('.tit span'), { type: 'chars' });

    gsap.set(title.chars, { y: '-10px', opacity: 0, filter: 'blur(15px)' });
    gsap.set(text.chars, { y: '-5px', opacity: 0, filter: 'blur(15px)' });

    card.addEventListener('mouseenter', function () {
      gsap.to(title.chars, {
        y: '0',
        filter: 'blur(0px)',
        opacity: 1,
        stagger: () => gsap.utils.random(0, 0.2),
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.to(text.chars, {
        y: '0',
        filter: 'blur(0px)',
        opacity: 1,
        stagger: () => gsap.utils.random(0, 0.3),
        duration: 0.6,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', function () {
      gsap.to(title.chars, {
        y: '10px',
        filter: 'blur(10px)',
        opacity: 0,
        stagger: () => gsap.utils.random(0, 0.2),
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => gsap.set(title.chars, { y: '-10px', opacity: 0, filter: 'blur(15px)' }), // 원래 상태로 복귀
      });

      gsap.to(text.chars, {
        y: '10px',
        filter: 'blur(10px)',
        opacity: 0,
        stagger: () => gsap.utils.random(0, 0.3),
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => gsap.set(text.chars, { y: '-5px', opacity: 0, filter: 'blur(15px)' }), // 원래 상태로 복귀
      });
    });
  });
}

// * =============== marquee text ===============v *//
function marqueeTextEffect() {
  const swiper = new Swiper('.marqueeSwiper', {
    slidesPerView: 'auto',
    speed: 4000,
    loop: true,
    spaceBetween: 20,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freemode: false,
    allowTouchMove: false,
    disabledOnInteraction: true,
    loopAdditionalSlides: 1,
    // centeredSlides: true,
  });
}

window.addEventListener('load', function () {
  cursorFunc();
  splitTextEffect();
  marqueeTextEffect();
});
