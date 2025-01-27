const fs = require('fs').promises;
const path = require('path');
const openaiClient = require('../utils/openaiClient');

async function translateRandomFiles() {
    try {
        // 번역할 파일 번호 배열 (random-1.json부터 random-6.json까지)
        const fileNumbers = [1, 2, 3, 4, 5, 6];
        
        for (const num of fileNumbers) {
            console.log(`\nProcessing random-${num}.json`);
            
            // 한국어 원본 파일 읽기
            const sourceFile = path.join('lang', 'ko', `random-${num}.json`);
            const sourceContent = await fs.readFile(sourceFile, 'utf8');
            
            // 모든 언어로 번역
            console.log('Starting translation process...');
            const translations = await openaiClient.translateToAllLanguages(sourceContent);
            
            // 각 언어별로 파일 저장
            for (const [langCode, translatedContent] of Object.entries(translations)) {
                const targetDir = path.join('lang', langCode);
                const targetFile = path.join(targetDir, `random-${num}.json`);
                
                // 디렉토리 존재 확인 및 생성
                try {
                    await fs.access(targetDir);
                } catch {
                    await fs.mkdir(targetDir, { recursive: true });
                }
                
                // 번역된 내용 저장
                await fs.writeFile(targetFile, translatedContent, 'utf8');
                console.log(`Saved translation for ${langCode}: ${targetFile}`);
            }
            
            // 각 파일 처리 사이에 2초 대기 (API 속도 제한 고려)
            if (num < fileNumbers.length - 1) {
                console.log('Waiting before processing next file...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        console.log('\nTranslation process completed successfully!');
    } catch (error) {
        console.error('Translation process failed:', error.message);
        process.exit(1);
    }
}

// 스크립트 실행
if (require.main === module) {
    console.log('Starting translation process for all random files...');
    translateRandomFiles();
} 