const openBtn = document.querySelector(".page-header__open-btn");
const closeBtn = document.querySelector(".main-nav__close-btn");
const navList = document.querySelector(".nav-list");

openBtn.addEventListener("click", function () {
  navList.classList.add("nav-list--show")
  closeBtn.classList.add("main-nav__close-btn--show")
  openBtn.classList.add("page-header__open-btn--hidden")
})

closeBtn.addEventListener("click", function () {
  navList.classList.remove("nav-list--show")
  closeBtn.classList.remove("main-nav__close-btn--show")
  openBtn.classList.remove("page-header__open-btn--hidden")
})
