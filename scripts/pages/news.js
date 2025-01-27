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
                div.offsetHeight;
            }
        });
    }

    /* 랜덤 hero 배너 */
    const newsHero = [
        "random-banner/news-hero-1.png",
        "random-banner/news-hero-2.png",
        "random-banner/news-hero-3.png",
        "random-banner/news-hero-4.png",
    ];
    setRandomBackgroundImage(newsHero, ".random-hero-image")

    
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

/* swiper slider 설정 */
document.addEventListener("DOMContentLoaded", () => {

    const newsNewsSwiper = new Swiper('.news-news-division', {
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

    newsNewsSwiper.on('activeIndexChange', () => {
        // 모든 슬라이드에서 active-center-card 클래스 제거
        document.querySelectorAll('.news-news-division-card').forEach((slide) => {
            slide.classList.remove('active-center-card');
        });
    
        // 가운데 슬라이드에 active-center-card 클래스 추가
        const activeCenterCard = newsNewsSwiper.slides[newsNewsSwiper.activeIndex + 1];
        if (activeCenterCard) {
            activeCenterCard.classList.add('active-center-card');
        }
    });
});