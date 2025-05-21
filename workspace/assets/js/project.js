// * =============== projectTitle ===============v *//
function projectTitle() {
  const title = document.querySelector('.prj-name .tit');
  const titleWrap = document.querySelector('.prj-name');

  if (title) {
    titleWrap.classList.add('is-show');
  }
}

const contentStaggerTopAnime = () => {
  const staggers = document.querySelectorAll('.stagger-prj');

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

document.addEventListener('DOMContentLoaded', function () {
  projectTitle();
  contentStaggerTopAnime();
});
