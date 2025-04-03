gsap.registerPlugin(ScrollTrigger);

// * =============== scrollSmoother ===============v *//
function scrollSmoother() {
  ScrollSmoother.create({
    smooth: 1,
    speed: 0.95,
    effects: true,
  });
}

// * =============== cursor ===============v *//
function cursorFunc() {
  const cursor = document.getElementById('cursor');
  const cards = document.querySelectorAll('.card');
  const footer = document.querySelector('footer');
  const footerText = document.querySelector('footer .f-txt');

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

  // ✨ 카드에 호버시 cursor_preview 클래스 추가
  cards.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor_preview');
    });

    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor_preview');
    });
  });

  // ✨ footer 호버시 클래스 추가
  footer.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor_point');
  });
  footer.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor_point');
  });

  // ✨ footer text 호버시 클래스 추가
  footerText.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor_sendEmail');
  });
  footerText.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor_sendEmail');
  });
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

// * =============== split nav ===============v *//
// function splitNavEffect() {
//   const menuItems = document.querySelectorAll('nav li');
//   const menuText = document.querySelector('.menu .word');

//   console.log(menuText);

//   menuItems.forEach((item) => {
//     const splitLines = item.querySelectorAll('.split-line');
//     if (splitLines.length < 2) return; // 두 개의 요소가 없는 경우 건너뜀

//     const splitText1 = new SplitText(splitLines[0], { type: 'chars' });
//     const splitText2 = new SplitText(splitLines[1], { type: 'chars' });

//     item.addEventListener('mouseenter', () => {
//       // cursor.classList.add('cursor_nav');
//       gsap.to(splitLines[0], {
//         y: '-100%',
//         duration: 0.15,
//         ease: 'power2.out',
//       });
//       gsap.to(splitLines[1], {
//         y: '-100%',
//         duration: 0.15,
//         ease: 'power2.out',
//       });
//     });

//     item.addEventListener('mouseleave', () => {
//       // cursor.classList.remove('cursor_nav');

//       gsap.to(splitLines[0], {
//         y: 0,
//         duration: 0.15,
//         ease: 'power2.out',
//       });
//       gsap.to(splitLines[1], {
//         y: 0,
//         duration: 0.15,
//         ease: 'power2.out',
//       });
//     });
//   });

// }

function splitNavEffect() {
  const menuItems = document.querySelectorAll('nav li');
  const menuText = document.querySelector('.menu .word');

  if (menuText) {
    const splitLines = menuText.querySelectorAll('.split-line');
    if (splitLines.length < 2) return;

    const splitText1 = new SplitText(splitLines[0], { type: 'chars' });
    const splitText2 = new SplitText(splitLines[1], { type: 'chars' });

    menuText.addEventListener('mouseenter', () => {
      gsap.to(splitLines[0], {
        y: '-100%',
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: '-100%',
        duration: 0.15,
        ease: 'power2.out',
      });
    });

    menuText.addEventListener('mouseleave', () => {
      gsap.to(splitLines[0], {
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      });
    });
  }

  menuItems.forEach((item) => {
    const splitLines = item.querySelectorAll('.split-line');
    if (splitLines.length < 2) return;

    const splitText1 = new SplitText(splitLines[0], { type: 'chars' });
    const splitText2 = new SplitText(splitLines[1], { type: 'chars' });

    item.addEventListener('mouseenter', () => {
      gsap.to(splitLines[0], {
        y: '-100%',
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: '-100%',
        duration: 0.15,
        ease: 'power2.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(splitLines[0], {
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
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

// * =============== sticky scrolling card ===============v *//
function scrollCardsFunc() {
  const contentWrap = document.querySelector('.sec-work .content-wrap');
  const listItem = document.querySelector('.card-content ul li');

  const tl = gsap.timeline({
    scrollTrigger: {
      // trigger: contentWrap,
      pin: true,
      scrub: 0.3,
      start: 'top top',
      pin: '.typo-wrap',
      end: () => `+=${listItem.length * 300}`, // 리스트 개수에 따라 스크롤 길이 조정
      // markers: true,
    },
  });

  // listItem.forEach((item, index) => {
  //   tl.to(item, { y: 0, duration: 0.5 }, index * 0.3);
  // });

  // tl.add(() => {
  //   ScrollTrigger.getById('scrollTriggerId')?.kill();
  // });
}

// * =============== scrollTrigger - footer ===============v *//
function scrollFooter() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: 'footer',
      start: 'top-=50% center',
      end: 'top top',
      ease: 'power2.out',
      scrub: 1,
      // markers: true,
    },
  });

  tl.to('.main > .content', {
    scale: 0.97,
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
  }).fromTo(
    'footer .content',
    { opacity: 0.7, y: '-25%' },
    { opacity: 1, y: 0 },
    0 // 두 tl 모두 동시에 동작
  );
}

window.addEventListener('load', function () {
  scrollSmoother();
  cursorFunc();
  splitTextEffect();
  splitNavEffect();
  marqueeTextEffect();
  scrollCardsFunc();
  scrollFooter();
});

// https://locomotive.ca/en
