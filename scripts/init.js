const fs = require('fs-extra');
const path = require('path');

const REQUIRED_DIRS = [
    'random-banner',
    'lang/ko',
    'lang/en',
    'lang/ja',
    'lang/zh',
    'lang/de',
    'lang/fr',
    'logs'
];

async function initializeDirectories() {
    console.log('Creating required directories...');
    
    for (const dir of REQUIRED_DIRS) {
        const dirPath = path.join(__dirname, '..', dir);
        await fs.ensureDir(dirPath);
        console.log(`✓ Created directory: ${dir}`);
    }
}

// 기본 언어 파일 생성
async function createDefaultLanguageFiles() {
    console.log('\nCreating default language files...');
    
    const defaultContent = {
        "random-vision-text": "더 나은 미래를 위해<br>끊임없이 연구하며 성장합니다.",
        "vision-card-random-text-1": "글로벌 전장 시장의 선도주자",
        "vision-card-random-text-2": "고정밀 가공기술 중심 설비 생산",
        "vision-card-random-text-3": "글로벌 인증과 기술 혁신",
        "vision-card-random-text-4": "세계 시장을 선도하는 파트너십"
    };

    for (let i = 1; i <= 6; i++) {
        const filePath = path.join(__dirname, '..', 'lang', 'ko', `random-${i}.json`);
        if (!await fs.pathExists(filePath)) {
            await fs.writeJson(filePath, defaultContent, { spaces: 2 });
            console.log(`✓ Created default language file: random-${i}.json`);
        }
    }
}

async function init() {
    try {
        await initializeDirectories();
        await createDefaultLanguageFiles();
        console.log('\nInitialization completed successfully!');
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1);
    }
}

// 직접 실행 시
if (require.main === module) {
    init();
}

module.exports = init; 