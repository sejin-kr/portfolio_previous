// 랜덤 이미지 배열
const randomImages = [
  '../assets/images/test.jpg',
  '../assets/images/profile.png',
  '../assets/images/project/project_simmons.png',
  '../assets/images/project/project_dd.png',
  '../assets/images/project/project_sdc2023.png',
  '../assets/images/project/project_vdao.png',
  '../assets/images/project/project_iqsc.png',
  '../assets/images/project/project_offbrand.png',
];

// 이미지 변경 함수
function changeRandomImage() {
  const imgBox = document.querySelector('.sec-about .title-b .img-box img');
  if (!imgBox) return;

  const randomIndex = Math.floor(Math.random() * randomImages.length);
  imgBox.src = randomImages[randomIndex];
}

// 스크롤 이벤트 리스너
let scrollTimeout;
window.addEventListener('scroll', () => {
  const aboutSection = document.querySelector('.sec-about');
  if (!aboutSection) return;

  const rect = aboutSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  if (isInView) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(changeRandomImage, 100); // 스크롤 속도에 따라 이미지 변경 간격 조절
  }
});

function randomImgScroll() {
  const imgBox = document.querySelector('.sec-about .title-b .img-box');
  if (!imgBox) return;

  // 이미지 컨테이너 스타일 설정
  imgBox.style.position = 'relative';
  imgBox.style.overflow = 'hidden';

  // 이미지 요소들 가져오기
  const images = imgBox.querySelectorAll('img');

  // 이미지 스타일 설정
  images.forEach((img, index) => {
    img.style.position = 'absolute';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.transition = 'transform 0.3s ease-in-out';
    img.style.transform = 'scale(1.25)';
    img.style.zIndex = index + 1;
    img.style.visibility = 'visible';
  });

  // 초기 이미지 설정
  images[0].style.transform = 'scale(1)';
  let currentIndex = 0;
  let isAnimating = false;
  let lastScrollTime = Date.now();
  let scrollSpeed = 0;

  gsap.to(imgBox, {
    scrollTrigger: {
      trigger: '.sec-about',
      start: 'top center',
      end: 'bottom center',
      onUpdate: (self) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        scrollSpeed = Math.abs(self.getVelocity());
        lastScrollTime = currentTime;

        if (!isAnimating && scrollSpeed > 0.5) {
          isAnimating = true;

          // 현재 이미지 확대
          gsap.to(images[currentIndex], {
            scale: 1.25,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
              // 다음 이미지로 변경
              currentIndex = (currentIndex + 1) % images.length;

              // 새 이미지 축소
              gsap.to(images[currentIndex], {
                scale: 1,
                duration: 0.3,
                ease: 'power2.inOut',
                onComplete: () => {
                  isAnimating = false;
                },
              });
            },
          });
        }
      },
    },
  });
}

// 함수 실행
randomImgScroll();
