gsap.registerPlugin(ScrollTrigger);

// * =============== scrollSmoother ===============v *//
function scrollSmoother() {
  ScrollSmoother.create({
    smooth: 1,
    speed: 0.96,
    effects: true,
  });
}

// * =============== cursor ===============v *//
function cursorFunc() {
  const main = document.querySelector('.main');
  const cursor = document.getElementById('cursor');
  const cards = document.querySelectorAll('.card');
  const footer = document.querySelector('footer');
  const footerText = document.querySelector('footer .f-txt');

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

  if (!main) return;

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

// * =============== hide Header ===============v *//
function headerVisibility() {
  const main = document.querySelector('.main');
  const nav = document.querySelector('header nav');
  const header = document.querySelector('header');

  if (!nav) return;

  if (main) {
    header.classList.add('new-load');
    nav.classList.add('is-visible');
    nav.classList.remove('is-hidden');
  } else {
    header.classList.add('new-load');
    nav.classList.add('is-hidden');
  }
}

// * =============== check number of projects ===============v *//
function checkProject() {
  const main = document.querySelector('.main');
  const prjItems = document.querySelectorAll('.project-list li');
  const countNum = document.querySelector('.sec-work .title-box span');

  if (!main) return;

  const count = prjItems.length;
  const formattedCount = count < 10 ? `0${count}` : `${count}`;

  countNum.textContent = `(${formattedCount}+)`;
}

// * =============== Scroll Anime - Top ===============v *//
const staggerTopAnime = () => {
  const staggers = document.querySelectorAll('.stagger-top');

  if (staggers) {
    staggers.forEach((stagger) => {
      const staggerItems = stagger.querySelectorAll('.stagger-item');
      const setY = window.innerHeight > 768 ? 20 : 10;

      gsap.set(staggerItems, { y: setY, opacity: 0 });

      gsap.to(staggerItems, {
        y: 0,
        stagger: 0.5, // long이 true일 경우 간격을 더 길게 설정
        duration: 0.8,
        opacity: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: stagger,
          start: 'top 80%',
          // markers: true,
        },
      });
    });
  }
};

// * =============== Scroll Anime - Default ===============v *//
const staggerAnime = () => {
  const staggers = document.querySelectorAll('.stagger');

  if (staggers) {
    staggers.forEach((stagger) => {
      const staggerItems = stagger.querySelectorAll('.stagger-item');
      const setY = window.innerHeight > 768 ? 20 : 10;

      gsap.set(staggerItems, { y: setY, opacity: 0 });

      gsap.to(staggerItems, {
        y: 0,
        stagger: 0.5, // long이 true일 경우 간격을 더 길게 설정
        duration: 0.8,
        opacity: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: stagger,
          start: 'top 30%',
          // markers: true,
        },
      });
    });
  }
};

// * =============== Scroll Anime - Opacity  ===============v *//
// 콘텐츠가 opacity와 함께 나타나는 애니메이션 //
const staggerOpacityAnime = () => {
  // StaggerAnime opacity 효과
  const staggers = document.querySelectorAll('.stagger-opacity');

  if (staggers) {
    staggers.forEach((stagger) => {
      const staggerItems = stagger.querySelectorAll('.stagger-opacity-item');

      gsap.set(staggerItems, { opacity: 0 });

      gsap.to(staggerItems, {
        stagger: 0.3,
        duration: 1,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: stagger,
          start: 'top 30%',
          // markers: true,
        },
      });
    });
  }
};

// * =============== Shuffle Text ===============v *//
function shuffleText() {
  const shuffleTextElements = document.querySelector('.shuffleText');
  const targetTexts = document.querySelectorAll('.shuffleText .title-box h3');
  const velocity = 85; // 효과 속도(ms)

  const content = document.querySelector('.content');
  const header = document.querySelector('header');

  if (!shuffleTextElements) return;

  // * mix text
  const shuffle = function (array) {
    for (
      let j, x, i = array.length;
      i;
      j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x
    );
    return array;
  };

  // * animation
  const shuffleText = function (element, originalText) {
    const elementTextArray = Array.from(originalText);
    let randomText = [];
    const repeatShuffle = function (times, index) {
      if (index === times) {
        element.textContent = originalText; // set the final text
        return;
      }
      setTimeout(function () {
        randomText = shuffle([...elementTextArray]); // mix array
        for (let i = 0; i < index; i++) {
          randomText[i] = originalText[i]; // only partially fixed
        }
        randomText = randomText.join('');
        element.textContent = randomText; // update text
        repeatShuffle(times, index + 1); // recursive call
      }, velocity);
    };
    repeatShuffle(originalText.length, 0);
  };

  // * set the event
  ScrollTrigger.create({
    trigger: shuffleTextElements,
    start: 'top 30%',
    end: 'bottom-=20% 30%',
    // once: true,
    // markers: true,
    onEnter: () => {
      // console.log('onEnter');
      content.classList.add('in-view');
      header.classList.add('in-view');

      targetTexts.forEach((el) => {
        const originalText = el.textContent.trim();
        shuffleText(el, originalText);
      });
    },
    onEnterBack: () => {
      content.classList.add('in-view');
      header.classList.add('in-view');
    },
    onLeave: () => {
      // console.log('onLeave');
      content.classList.remove('in-view');
      header.classList.remove('in-view');
    },
    onLeaveBack: () => {
      content.classList.remove('in-view');
      header.classList.remove('in-view');
    },
  });
}

// * =============== Update Project order ===============v *//
// Animates and updates the project number on scroll. //
function updateProjectOrder() {
  const main = document.querySelector('.main');

  if (!main) return;

  const cards = document.querySelectorAll('.project-list li');
  const orderBox = document.querySelector('.order-box');
  const strongs = orderBox.querySelectorAll('.order-box strong');

  let currentIndex = 0;
  let isAnimating = false;

  gsap.set(strongs[0], { yPercent: 0, opacity: 1 });
  gsap.set(strongs[1], { yPercent: 100, opacity: 0 });

  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      // markers: true,
      onEnter: () => animateTo(index),
      onEnterBack: () => animateTo(index),
    });
  });

  function animateTo(targetIndex) {
    if (isAnimating || targetIndex === currentIndex) return;
    isAnimating = true;

    const currentEl = strongs[currentIndex % 2];
    const nextEl = strongs[(currentIndex + 1) % 2];

    const newNum = String(targetIndex + 1).padStart(2, '0') + '.';
    nextEl.textContent = newNum;

    // 위치 초기화: 아래쪽에 배치
    gsap.set(nextEl, { yPercent: 100, opacity: 1 });

    // 애니메이션: 현재 → 위로, 다음 → 올라옴
    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = targetIndex;
        isAnimating = false;
      },
    });

    tl.to(currentEl, { yPercent: -100, duration: 0.2, ease: 'power2.in' }, 0).to(
      nextEl,
      { yPercent: 0, duration: 0.2, ease: 'power2.in' },
      0
    );
  }
}

// * =============== split text ===============v *//
function splitTextEffect() {
  document.querySelectorAll('.card').forEach((card) => {
    const title = new SplitText(card.querySelector('.tit strong'), { type: 'chars' });
    const text = new SplitText(card.querySelector('.tit span'), { type: 'chars' });

    gsap.set(title.chars, { y: '-10px', opacity: 0, filter: 'blur(15px)' });
    gsap.set(text.chars, { y: '-5px', opacity: 0, filter: 'blur(15px)' });

    card.addEventListener('mouseenter', function () {
      gsap.killTweensOf(title.chars);
      gsap.killTweensOf(text.chars);

      gsap.to(title.chars, {
        y: '0',
        filter: 'blur(0px)',
        opacity: 1,
        stagger: () => gsap.utils.random(0, 0.2),
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(text.chars, {
        y: '0',
        filter: 'blur(0px)',
        opacity: 1,
        stagger: () => gsap.utils.random(0, 0.3),
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', function () {
      gsap.killTweensOf(title.chars);
      gsap.killTweensOf(text.chars);

      gsap.to(title.chars, {
        y: '10px',
        filter: 'blur(5px)',
        opacity: 0,
        stagger: () => gsap.utils.random(0, 0.2),
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => gsap.set(title.chars, { y: '-10px', opacity: 0, filter: 'blur(5px)' }), // 원래 상태로 복귀
      });

      gsap.to(text.chars, {
        y: '10px',
        filter: 'blur(5px)',
        opacity: 0,
        stagger: () => gsap.utils.random(0, 0.3),
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => gsap.set(text.chars, { y: '-5px', opacity: 0, filter: 'blur(5px)' }), // 원래 상태로 복귀
      });
    });
  });
}

// * =============== split nav ===============v *//
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
        duration: 0.12,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: '-100%',
        duration: 0.12,
        ease: 'power2.out',
      });
    });

    menuText.addEventListener('mouseleave', () => {
      gsap.to(splitLines[0], {
        y: 0,
        duration: 0.12,
        ease: 'power2.out',
      });
      gsap.to(splitLines[1], {
        y: 0,
        duration: 0.12,
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
    freemode: true,
    freeModeMomentum: false,
    allowTouchMove: false,
    loopAdditionalSlides: 5,
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
      // pin: true,
      scrub: 0.3,
      start: 'top top',
      // pin: '.typo-wrap',
      // end: () => `+=${listItem.length * 300}`, // 리스트 개수에 따라 스크롤 길이 조정
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
  const main = document.querySelector('.main');

  if (!main) return;

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

// * =============== offsetTop ===============v *//
function moveToOffsetTop() {
  const menu = document.querySelectorAll('header nav li');

  menu.forEach((item) => {
    item.addEventListener('click', function (e) {
      const link = this.querySelector('a');
      const targetId = link.getAttribute('href');

      if (!targetId.startsWith('#')) return;

      e.preventDefault();

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// * =============== backToTop ===============v *//
function backToTop() {
  const main = document.querySelector('.main');
  const topBtn = document.querySelector('.backToTop');

  if (!main) return;

  topBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

window.addEventListener('load', function () {
  // scrollSmoother();
  cursorFunc();
  checkProject();
  shuffleText();
  staggerTopAnime();
  staggerAnime();
  staggerOpacityAnime();
  // splitTextEffect();
  updateProjectOrder();
  splitNavEffect();
  marqueeTextEffect();
  scrollCardsFunc();
  scrollFooter();
  moveToOffsetTop();
  backToTop();
});

window.addEventListener('DOMContentLoaded', function () {
  headerVisibility();
});

// https://locomotive.ca/en
// https://www.oharchitecture.com.au/
// https://www.byhuy.com/
