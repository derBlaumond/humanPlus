document.addEventListener("DOMContentLoaded", () => {
    const textElements = document.querySelectorAll("[data-i18n]");
    const maxFiles = 6; // 총 JSON 파일 개수 (1 ~ 6번 파일)
    const randomFileKey = "selectedJsonFile"; // sessionStorage 키 이름
    const languageKey = "selectedLanguage";

    // Load language preference from localStorage
    function getPreferredLanguage() {
        return localStorage.getItem(languageKey) || navigator.language.split("-")[0];
    }

    // Save language preference
    function saveLanguagePreference(lang) {
        localStorage.setItem(languageKey, lang);
    }

    // Get random file number with persistence
    function getRandomFileNumber() {
        let fileNumber = sessionStorage.getItem(randomFileKey);
        if (!fileNumber) {
            fileNumber = Math.floor(Math.random() * maxFiles) + 1;
            sessionStorage.setItem(randomFileKey, fileNumber);
        }
        return fileNumber;
    }

    // Load language data with improved error handling and caching
    async function loadLanguage(language, selectedFileNumber) {
        try {
            const response = await fetch(`/api/lang/random?files=random-${selectedFileNumber}&lang=${language}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const translations = await response.json();
            
            textElements.forEach((element) => {
                const key = element.getAttribute("data-i18n");
                if (translations[key]) {
                    // innerHTML 사용하여 HTML 태그 보존
                    element.innerHTML = translations[key];
                }
            });
            
            // 언어 스위처 업데이트
            const langSwitcher = document.querySelector('.language-switcher');
            if (langSwitcher) {
                langSwitcher.value = language;
            }
            
        } catch (error) {
            console.error('Failed to load language:', error);
            // 영어로 폴백
            if (language !== 'en') {
                return loadLanguage('en', selectedFileNumber);
            }
        }
    }

    // Update images based on language
    function updateImages(language) {
        if (language !== 'ko') {
            const cncHistoryImg = document.querySelector('.cnc-history-img');
            const electronicsHistoryImg = document.querySelector('.electronics-history-img');
            if (cncHistoryImg) {
                cncHistoryImg.src = "resources/img/연혁-cnc-division-en.png";
            }
            if (electronicsHistoryImg) {
                electronicsHistoryImg.src = "resources/img/연혁-electronic-division-en.png";
            }
        }
    }

    // Initialize language
    const selectedFileNumber = getRandomFileNumber();
    const preferredLanguage = getPreferredLanguage();
    
    // Load initial language
    loadLanguage(preferredLanguage, selectedFileNumber);
    
    // Set up language switcher if it exists
    const langSwitcher = document.querySelector('.language-switcher');
    if (langSwitcher) {
        langSwitcher.value = preferredLanguage;
        langSwitcher.addEventListener('change', (e) => {
            const newLang = e.target.value;
            saveLanguagePreference(newLang);
            loadLanguage(newLang, selectedFileNumber);
        });
    }

    async function insertRandomTexts() {
        try {
            const response = await fetch(`/api/lang/random?files=random-1,random-2,random-3,random-4,random-5,random-6`);
            const texts = await response.json();
            
            // HTML 요소에 텍스트 삽입
            Object.entries(texts).forEach(([key, value]) => {
                const elements = document.querySelectorAll(`[data-text="${key}"]`);
                elements.forEach(element => {
                    element.innerHTML = value; // innerHTML 사용하여 HTML 태그 보존
                });
            });
        } catch (error) {
            console.error('Failed to insert random texts:', error);
        }
    }
});
