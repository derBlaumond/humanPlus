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

    /* 랜덤 hero 배너 */
    const indexHero1 = [
        "random-banner/index-hero-1-1.png",
        "random-banner/index-hero-1-2.png",
        "random-banner/index-hero-1-3.png",
        "random-banner/index-hero-1-4.png",
    ];
    setRandomImage(indexHero1, ".random-hero-image-1")

    const indexHero2 = [
        "random-banner/index-hero-2-1.png",
        "random-banner/index-hero-2-2.png",
        "random-banner/index-hero-2-3.png",
        "random-banner/index-hero-2-4.png",
    ];
    setRandomImage(indexHero2, ".random-hero-image-2")

    const indexHero3 = [
        "random-banner/index-hero-3-1.png",
        "random-banner/index-hero-3-2.png",
        "random-banner/index-hero-3-3.png",
        "random-banner/index-hero-3-4.png",
    ];
    setRandomImage(indexHero3, ".random-hero-image-3")

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

    const visionCard1 = [
        "random-banner/vision-card-1-1.png",
        "random-banner/vision-card-1-2.png",
        "random-banner/vision-card-1-3.png",
        "random-banner/vision-card-1-4.png",
    ];
    setRandomImage(visionCard1, ".random-vision-card-1")

    const visionCard2 = [
        "random-banner/vision-card-2-1.png",
        "random-banner/vision-card-2-2.png",
        "random-banner/vision-card-2-3.png",
        "random-banner/vision-card-2-4.png",
    ];
    setRandomImage(visionCard2, ".random-vision-card-2")

    const visionCard3 = [
        "random-banner/vision-card-3-1.png",
        "random-banner/vision-card-3-2.png",
        "random-banner/vision-card-3-3.png",
        "random-banner/vision-card-3-4.png",
        "random-banner/vision-card-3-5.png",
    ];
    setRandomImage(visionCard3, ".random-vision-card-3")

    const visionCard4 = [
        "random-banner/vision-card-4-1.png",
        "random-banner/vision-card-4-2.png",
        "random-banner/vision-card-4-3.png",
        "random-banner/vision-card-4-4.png",
        "random-banner/vision-card-4-5.png",
    ];
    setRandomImage(visionCard4, ".random-vision-card-4")
});

/* 카드 상하 애니메이션 설정 */
const containers = document.querySelectorAll(".ci-card-container");
// If a user hasn't opted in for recuded motion, then we add the animation
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
}

function addAnimation() {
    containers.forEach((container) => {
        const cards = Array.from(container.children);
        cards.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            container.appendChild(duplicatedItem);
        });
        const expectedHeight = cards.length * 2 * 290;
        container.style.height = `${expectedHeight}px`;
    });
}

/* swiper slider 설정 */
document.addEventListener("DOMContentLoaded", () => {
    const electronicsSwiper = new Swiper('.electronics-division', {
        loop: true,
        spaceBetween: 80,
        slidesPerView: 3,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive
        breakpoints: {
            0: {
                spaceBetween: 10,
            }, 
            768: {
                spaceBetween: 30,
            }, 
            1024: {
                spaceBetween: 80,
            }, 
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
    });

    electronicsSwiper.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.electronics-division-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = electronicsSwiper.slides[electronicsSwiper.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });

    const cncSwiper = new Swiper('.cnc-division', {
        loop: true,
        spaceBetween: 80,
        slidesPerView: 3,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive
        breakpoints: {
            0: {
                spaceBetween: 10,
            }, 
            768: {
                spaceBetween: 30,
            }, 
            1024: {
                spaceBetween: 80,
            }, 
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
    });

    cncSwiper.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.cnc-division-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = cncSwiper.slides[cncSwiper.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });

    const newsSwiper = new Swiper('.news-division', {
        loop: true,
        spaceBetween: 80,
        slidesPerView: 3,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // Responsive
        breakpoints: {
            0: {
                spaceBetween: 10,
            }, 
            768: {
                spaceBetween: 30,
            }, 
            1024: {
                spaceBetween: 80,
            }, 
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
    });

    newsSwiper.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.news-division-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = newsSwiper.slides[newsSwiper.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });
});