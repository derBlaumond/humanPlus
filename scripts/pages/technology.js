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
    const technologyHero = [
        "random-banner/technology-hero-1.png",
        "random-banner/technology-hero-2.png",
        "random-banner/technology-hero-3.png",
        "random-banner/technology-hero-4.png",
        "random-banner/technology-hero-5.png",
    ];
    setRandomImage(technologyHero, ".random-hero-image")

    const electronicsImage = [
        "random-banner/electronics-1.png",
        "random-banner/electronics-2.png",
        "random-banner/electronics-3.png",
        "random-banner/electronics-4.png",
    ]
    setRandomBackgroundImage(electronicsImage, ".random-electronics-image")

    const cncImage = [
        "random-banner/cnc-1.png",
        "random-banner/cnc-2.png",
        "random-banner/cnc-3.png",
        "random-banner/cnc-4.png",
    ]
    setRandomBackgroundImage(cncImage, ".random-cnc-image")
});

/* swiper slider 설정 */
document.addEventListener("DOMContentLoaded", () => {
    const electronicsMajorProduct = new Swiper('.electronics-major-product', {
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

    electronicsMajorProduct.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.electronics-major-product-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = electronicsMajorProduct.slides[electronicsMajorProduct.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });


    const cncMajorProduct = new Swiper('.cnc-major-product', {
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

    cncMajorProduct.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.cnc-major-product-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = cncMajorProduct.slides[cncMajorProduct.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });
});