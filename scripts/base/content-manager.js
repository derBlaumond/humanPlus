class ContentManager {
    constructor() {
        this.randomDataFiles = Array.from(
            { length: 6 }, 
            (_, i) => `random-${i + 1}.json`
        );
        this.langCode = localStorage.getItem('selectedLanguage') || 'ko';
        this.currentRandomData = null;
        this.currentFileIndex = parseInt(sessionStorage.getItem('currentFileIndex')) || null;
        this.supportedLanguages = ['ko', 'en', 'fr', 'de', 'ja', 'zh'];
        
        // 랜덤 이미지 설정
        this.heroImages = Array.from(
            { length: 6 },
            (_, i) => `resources/img/hero-${i + 1}.png`
        );
        this.currentHeroImageIndex = parseInt(sessionStorage.getItem('currentHeroImageIndex')) || null;
        
        this.initializeLanguageSwitcher();
    }

    initializeLanguageSwitcher() {
        const languageSwitcher = document.querySelector('.language-switcher');
        if (languageSwitcher) {
            languageSwitcher.value = this.langCode;
            
            languageSwitcher.addEventListener('change', async (e) => {
                const newLang = e.target.value;
                if (this.supportedLanguages.includes(newLang)) {
                    await this.switchLanguage(newLang, languageSwitcher);
                } else {
                    console.error('Unsupported language:', newLang);
                    languageSwitcher.value = this.langCode;
                }
            });
        }
    }

    async switchLanguage(newLang, languageSwitcher) {
        const prevLang = this.langCode;
        try {
            this.langCode = newLang;
            localStorage.setItem('selectedLanguage', newLang);
            
            if (this.currentFileIndex !== null) {
                await this.loadContentForLanguage(this.currentFileIndex);
            } else {
                await this.loadRandomContent();
            }
        } catch (error) {
            console.error(`Failed to switch to language ${newLang}:`, error);
            this.langCode = prevLang;
            localStorage.setItem('selectedLanguage', prevLang);
            languageSwitcher.value = prevLang;
            this.showFallbackContent();
        }
    }

    async loadRandomContent() {
        try {
            // 랜덤 컨텐츠 파일 선택
            const newIndex = Math.floor(Math.random() * this.randomDataFiles.length);
            this.currentFileIndex = newIndex;
            sessionStorage.setItem('currentFileIndex', newIndex.toString());

            // 랜덤 이미지 선택
            const newImageIndex = Math.floor(Math.random() * this.heroImages.length);
            this.currentHeroImageIndex = newImageIndex;
            sessionStorage.setItem('currentHeroImageIndex', newImageIndex.toString());

            await this.loadContentForLanguage(newIndex);
        } catch (error) {
            console.error('Error loading random content:', error);
            this.showFallbackContent();
        }
    }

    async loadContentForLanguage(fileIndex) {
        const selectedFile = this.randomDataFiles[fileIndex];
        try {
            const response = await fetch(`/lang/${this.langCode}/${selectedFile}`);
            
            if (!response.ok) {
                throw new Error(`Failed to load content for ${this.langCode}/${selectedFile} (HTTP ${response.status})`);
            }

            const data = await response.json();
            
            if (!this.validateContent(data)) {
                throw new Error(`Invalid content structure for ${this.langCode}/${selectedFile}`);
            }

            this.currentRandomData = data;
            this.updateContent(data);
            this.updateImages();
        } catch (error) {
            console.error(`Error loading ${selectedFile} for language ${this.langCode}:`, error);
            throw error;
        }
    }

    validateContent(data) {
        const requiredKeys = [
            'random-vision-text',
            'vision-card-random-text-1',
            'vision-card-random-text-2',
            'vision-card-random-text-3',
            'vision-card-random-text-4',
            'index-hero-title-random-keyword1',
            'index-hero-title-random-keyword2',
            'index-hero-random-description'
        ];

        return requiredKeys.every(key => {
            const hasKey = key in data;
            if (!hasKey) {
                console.warn(`Missing required key: ${key}`);
            }
            return hasKey;
        });
    }

    updateContent(data) {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (data[key]) {
                element.innerHTML = data[key];
            }
        });

        this.updateImages();
    }

    updateImages() {
        // 언어별 고정 이미지 업데이트
        if (this.langCode !== 'ko') {
            const cncHistoryImg = document.querySelector('.cnc-history-img');
            const electronicsHistoryImg = document.querySelector('.electronics-history-img');
            if (cncHistoryImg) {
                cncHistoryImg.src = "resources/img/연혁-cnc-division-en.png";
            }
            if (electronicsHistoryImg) {
                electronicsHistoryImg.src = "resources/img/연혁-electronic-division-en.png";
            }
        } else {
            const cncHistoryImg = document.querySelector('.cnc-history-img');
            const electronicsHistoryImg = document.querySelector('.electronics-history-img');
            if (cncHistoryImg) {
                cncHistoryImg.src = "resources/img/연혁-cnc-division.png";
            }
            if (electronicsHistoryImg) {
                electronicsHistoryImg.src = "resources/img/연혁-electronic-division.png";
            }
        }

        // 랜덤 히어로 이미지 업데이트
        this.updateHeroImages();
    }

    updateHeroImages() {
        if (this.currentHeroImageIndex === null) return;

        // hero 이미지 업데이트
        const heroImages = document.querySelectorAll('.random-hero-image');
        heroImages.forEach((img, index) => {
            if (img) {
                const imageIndex = (this.currentHeroImageIndex + index) % this.heroImages.length;
                img.src = this.heroImages[imageIndex];
            }
        });

        // technology 페이지의 랜덤 이미지
        const techHeroImage = document.querySelector('.technology-hero .random-hero-image');
        if (techHeroImage) {
            techHeroImage.src = this.heroImages[this.currentHeroImageIndex];
        }

        // history 페이지의 랜덤 이미지
        const historyHeroImage = document.querySelector('.history-hero.random-history-hero');
        if (historyHeroImage) {
            historyHeroImage.style.backgroundImage = `url(${this.heroImages[this.currentHeroImageIndex]})`;
        }

        // news 페이지의 랜덤 이미지
        const newsHeroImage = document.querySelector('.news-hero.random-hero-image');
        if (newsHeroImage) {
            newsHeroImage.style.backgroundImage = `url(${this.heroImages[this.currentHeroImageIndex]})`;
        }
    }

    showFallbackContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key.includes('random-')) {
                element.innerHTML = 'Content temporarily unavailable';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager();
    
    contentManager.loadRandomContent();

    const refreshButton = document.getElementById('refresh-content');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            sessionStorage.removeItem('currentFileIndex');
            sessionStorage.removeItem('currentHeroImageIndex');
            contentManager.currentFileIndex = null;
            contentManager.currentHeroImageIndex = null;
            contentManager.loadRandomContent();
        });
    }
});