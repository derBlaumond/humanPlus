/* 반응형 nav bar */
const menuText = document.querySelector(".navbar-menu-text");
const menuIcon = document.querySelector(".navbar-menu-icon");
const menuToggle = document.querySelector(".navbar-menu-toggle");
const menuOverlay = document.querySelector(".navbar-menu-overlay");

menuText.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    menuToggle.classList.toggle("active")
});

menuIcon.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    menuToggle.classList.toggle("active")
});

const navbar = document.querySelector(".navbar");
let lastScrollY = window.scrollY; // 이전 스크롤 위치 저장

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        if (window.scrollY > lastScrollY) {
            // 스크롤 내릴 때 -> Nav Bar 숨기기
            navbar.style.transform = "translateY(-100%)";
        } else {
            // 스크롤 올릴 때 -> Nav Bar 나타내기
            navbar.style.transform = "translateY(0)";
        }
    }
    lastScrollY = window.scrollY; // 현재 스크롤 위치를 업데이트
});

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
        // 화면 크기가 768px 이상이면 menu-overlay 숨기기
        menuOverlay.classList.remove('active');
    }
});
