let openBtn = document.querySelector(".page-header__open-btn");
let closeBtn = document.querySelector(".main-nav__close-btn");
let navList = document.querySelector(".nav-list");

navList.classList.remove("nav-lsit--nojs");

openBtn.addEventListener("click", function () {
  navList.style.display = "block";
  closeBtn.style.display = "block";
  openBtn.style.display = "none";
})

closeBtn.addEventListener("click", function () {
  navList.style.display = "none";
  closeBtn.style.display = "none";
  openBtn.style.display = "block";
})
