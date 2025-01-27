class BannerLoader {
    constructor() {
        this.bannerCache = new Map();
        this.currentBanners = new Map();
    }

    async loadBanners(pageType) {
        try {
            const bannerElements = document.querySelectorAll(`[data-banner="${pageType}"]`);
            if (!bannerElements.length) return;

            const bannerConfig = await this.getBannerConfig(pageType);
            if (!bannerConfig) return;

            bannerElements.forEach((element, index) => {
                const bannerNumber = (index % bannerConfig.count) + 1;
                const variantNumber = Math.floor(Math.random() * bannerConfig.variants) + 1;
                const bannerKey = `${bannerConfig.prefix}${bannerNumber}-${variantNumber}`;

                this.loadAndDisplayBanner(element, bannerKey);
            });
        } catch (error) {
            console.error(`Failed to load banners for ${pageType}:`, error);
        }
    }

    async getBannerConfig(pageType) {
        try {
            const response = await fetch('/api/banner/config');
            if (!response.ok) throw new Error('Failed to fetch banner configuration');
            
            const config = await response.json();
            return config[pageType];
        } catch (error) {
            console.error('Error fetching banner configuration:', error);
            return null;
        }
    }

    async loadAndDisplayBanner(element, bannerKey) {
        try {
            let bannerUrl = this.bannerCache.get(bannerKey);
            
            if (!bannerUrl) {
                bannerUrl = `/random-banner/${bannerKey}.png`;
                this.bannerCache.set(bannerKey, bannerUrl);
            }

            // Create and load new image
            const img = new Image();
            img.onload = () => {
                element.style.backgroundImage = `url(${bannerUrl})`;
                element.classList.add('banner-loaded');
            };
            img.onerror = () => {
                console.error(`Failed to load banner: ${bannerKey}`);
                element.classList.add('banner-error');
            };
            img.src = bannerUrl;

            // Store current banner
            this.currentBanners.set(element, bannerKey);
        } catch (error) {
            console.error(`Failed to load banner ${bannerKey}:`, error);
        }
    }

    // Refresh specific banner
    async refreshBanner(element) {
        const currentBanner = this.currentBanners.get(element);
        if (!currentBanner) return;

        const [prefix, number, variant] = currentBanner.split('-');
        const config = await this.getBannerConfig(element.dataset.banner);
        if (!config) return;

        const newVariant = Math.floor(Math.random() * config.variants) + 1;
        const newBannerKey = `${prefix}-${number}-${newVariant}`;

        await this.loadAndDisplayBanner(element, newBannerKey);
    }

    // Refresh all banners of a specific type
    async refreshAllBanners(pageType) {
        const bannerElements = document.querySelectorAll(`[data-banner="${pageType}"]`);
        bannerElements.forEach(element => this.refreshBanner(element));
    }
}

// Initialize banner loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const bannerLoader = new BannerLoader();
    
    // Load banners for each page type
    ['main', 'news', 'history', 'technology', 'vision', 'company', 'electronics', 'cnc']
        .forEach(pageType => bannerLoader.loadBanners(pageType));

    // Optional: Add refresh button handlers
    document.querySelectorAll('.refresh-banner').forEach(button => {
        button.addEventListener('click', () => {
            const pageType = button.dataset.bannerType;
            if (pageType) {
                bannerLoader.refreshAllBanners(pageType);
            }
        });
    });
}); 