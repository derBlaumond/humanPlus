// DOM 로드 후 실행
document.addEventListener("DOMContentLoaded", () => {
    function setRandomImage(imagePaths, query) {
        const shuffledImages = imagePaths.sort(() => Math.random() - 0.5);

        // .hero-image 요소를 모두 선택
        const selectedImages = document.querySelectorAll(query);

        // 이미지 경로를 순회하며 src 속성에 설정
        selectedImages.forEach((img, index) => {
            if (index < shuffledImages.length) {
                img.src = shuffledImages[index]; // 배열 순서대로 이미지 설정
            } else {
                console.warn("이미지 개수가 HTML 이미지보다 부족합니다.");
                img.src = shuffledImages[shuffledImages.length - 1]
            }
        });
}

function setRandomBackgroundImage(imagePaths, query) {
    const shuffledImages = imagePaths.sort(() => Math.random() - 0.5);

    // .hero-image 요소를 모두 선택
    const selectedImages = document.querySelectorAll(query);

    // 이미지 경로를 순회하며 src 속성에 설정
    selectedImages.forEach((div, index) => {
        if (index < shuffledImages.length) {
            div.style.backgroundImage = `url('${shuffledImages[index]}')`
        } else {
            console.warn("이미지 개수가 HTML 이미지보다 부족합니다.");
            div.style.backgroundImage = `url('${shuffledImages[shuffledImages.length - 1]}')`
        }
    });
}

  /* 랜덤 hero 배너 */
const historyHero = [
    "random-banner/history-hero-1.png",
    "random-banner/history-hero-2.png",
    "random-banner/history-hero-3.png",
    "random-banner/history-hero-4.png",
];
setRandomBackgroundImage(historyHero, ".random-history-hero")

const historyImage = [
    "random-banner/history-image-1.png",
    "random-banner/history-image-2.png",
    "random-banner/history-image-3.png",
    "random-banner/history-image-4.png",
];
setRandomBackgroundImage(historyImage, ".random-history-image")

const companyOverview1 = [
    "random-banner/company-overview-1-1.png",
    "random-banner/company-overview-1-2.png",
    "random-banner/company-overview-1-3.png",
    "random-banner/company-overview-1-4.png",
]
setRandomImage(companyOverview1, ".random-company-overview-1")

const companyOverview2 = [
    "random-banner/company-overview-2-1.png",
    "random-banner/company-overview-2-2.png",
    "random-banner/company-overview-2-3.png",
    "random-banner/company-overview-2-4.png",
]
setRandomImage(companyOverview2, ".random-company-overview-2")

const companyOverview3 = [
    "random-banner/company-overview-3-1.png",
    "random-banner/company-overview-3-2.png",
    "random-banner/company-overview-3-3.png",
    "random-banner/company-overview-3-4.png",
]
setRandomImage(companyOverview3, ".random-company-overview-3")

const futureVision = [
    "random-banner/future-vision-1.png",
    "random-banner/future-vision-2.png",
    "random-banner/future-vision-3.png",
    "random-banner/future-vision-4.png",
    "random-banner/future-vision-5.png",
]
    setRandomImage(futureVision, ".random-future-vision")
});

const scrollers = document.querySelectorAll(".scroller");

// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
}

function addAnimation() {
    scrollers.forEach((scroller) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute("data-animated", true);

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);
        });
    });
}