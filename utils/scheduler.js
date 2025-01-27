const cron = require('node-cron');
const { BannerUpdater } = require('./bannerUpdater');
const { LanguageUpdater } = require('./languageUpdater');
const { generateAllSeries } = require('../scripts/generate-image');
const { generateAllTexts } = require('../scripts/generate-content');
const { translateAll } = require('../scripts/translate-content');
const logger = require('./logger');

class Scheduler {
    constructor() {
        this.bannerUpdater = new BannerUpdater();
        this.languageUpdater = new LanguageUpdater();
        this.schedule = process.env.UPDATE_SCHEDULE || '0 0 * * *'; // 기본값: 매일 자정
        this.isRunning = false;
        this.lastRun = null;
    }

    getNextRunTime() {
        const cronParser = require('cron-parser');
        try {
            const interval = cronParser.parseExpression(this.schedule);
            return interval.next().toDate();
        } catch (err) {
            logger.error('Failed to parse cron schedule:', err);
            return null;
        }
    }

    async generateNewContent() {
        try {
            logger.info('Starting content generation process...');
            
            // 1. 이미지 생성
            logger.info('Generating images...');
            const imageTypes = ['vision-card', 'company-overview', 'history-hero', 'cnc'];
            for (const type of imageTypes) {
                await generateAllSeries(type);
            }
            
            // 2. 텍스트 생성
            logger.info('Generating texts...');
            await generateAllTexts();
            
            // 3. 번역 실행
            logger.info('Running translations...');
            await translateAll();
            
            logger.info('Content generation completed successfully');
        } catch (error) {
            logger.error('Content generation failed:', error);
            throw error;
        }
    }

    async updateBanners() {
        try {
            logger.info('Starting banner update process...');
            const bannerTypes = ['banner-1.png', 'banner-2.png', 'banner-3.png', 'banner-4.png'];
            const pageTypes = ['main', 'news', 'history', 'technology'];

            for (let i = 0; i < bannerTypes.length; i++) {
                await this.bannerUpdater.updateBanner(pageTypes[i], bannerTypes[i]);
                logger.info(`Updated banner: ${bannerTypes[i]}`);
            }
            logger.info('Banner update process completed successfully');
        } catch (error) {
            logger.error('Failed to update banners:', error);
            throw error;
        }
    }

    async updateLanguages() {
        try {
            logger.info('Starting language update process...');
            const versions = [1, 2, 3, 4, 5, 6];
            
            for (const version of versions) {
                await this.languageUpdater.updateLanguageFile('en', version);
                logger.info(`Updated language files for version: random-${version}`);
            }
            logger.info('Language update process completed successfully');
        } catch (error) {
            logger.error('Failed to update languages:', error);
            throw error;
        }
    }

    async runUpdates() {
        if (this.isRunning) {
            logger.warn('Update process is already running');
            return;
        }

        this.isRunning = true;
        try {
            logger.info('Starting scheduled updates...');
            
            // 순차적으로 실행
            await this.generateNewContent();  // 새로운 콘텐츠 생성
            await this.updateBanners();       // 배너 업데이트
            await this.updateLanguages();     // 언어 파일 업데이트
            
            this.lastRun = new Date();
            logger.info('All scheduled updates completed successfully');
        } catch (error) {
            logger.error('Scheduled updates failed:', error);
            // 실패해도 스케줄러는 계속 실행되어야 함
        } finally {
            this.isRunning = false;
        }
    }

    initialize() {
        logger.info(`Initializing scheduler with schedule: ${this.schedule}`);
        
        // 스케줄된 작업 설정
        cron.schedule(this.schedule, async () => {
            await this.runUpdates();
        }, {
            timezone: "Asia/Seoul"  // 한국 시간 기준
        });

        logger.info('Scheduler initialized successfully');
    }
}

// 싱글톤 인스턴스 생성
const scheduler = new Scheduler();

module.exports = {
    initializeScheduler: () => scheduler.initialize(),
    scheduler // 테스트나 수동 실행을 위해 인스턴스 노출
}; 