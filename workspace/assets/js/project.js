// * =============== backToTop ===============v *//
function projectTitle() {
  const title = document.querySelector('.prj-name .tit');
  const titleWrap = document.querySelector('.prj-name');

  if (title) {
    titleWrap.classList.add('is-show');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  projectTitle();
});
