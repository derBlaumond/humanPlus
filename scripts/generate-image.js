require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs-extra');
const path = require('path');
const { imagePrompts, getPrompt } = require('../prompts/imagePrompts');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const OUTPUT_DIR = process.env.OUTPUT_DIR || 'random-banner';

// 이미지 저장 함수
async function saveImage(imageUrl, fileName) {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();
        const filePath = path.join(OUTPUT_DIR, fileName);
        await fs.ensureDir(OUTPUT_DIR);
        await fs.writeFile(filePath, Buffer.from(buffer));
        console.log(`Successfully saved: ${fileName}`);
    } catch (error) {
        console.error(`Error saving image ${fileName}:`, error);
        throw error;
    }
}

// 시리즈의 단일 이미지 생성 함수
async function generateSeriesImage(type, series, index) {
    try {
        const prompt = getPrompt(type, series);
        const fileName = `${type}-${series}-${index}.png`;
        console.log(`Generating image: ${fileName}`);
        console.log('Using prompt:', prompt);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            quality: "hd",
            style: "natural",
            response_format: "url"
        });

        const imageUrl = response.data[0].url;
        await saveImage(imageUrl, fileName);
    } catch (error) {
        console.error(`Error generating image ${type}-${series}-${index}:`, error);
        throw error;
    }
}

// 시리즈 이미지 생성 함수
async function generateSeries(type, series) {
    console.log(`\nGenerating series: ${type}-${series}`);
    for (let i = 1; i <= 4; i++) {
        try {
            await generateSeriesImage(type, series, i);
            // DALL-E API 레이트 리밋을 고려한 딜레이
            await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
            console.error(`Failed to generate image ${i} in series ${type}-${series}`);
        }
    }
}

// 단일 타입의 모든 시리즈 생성 함수
async function generateAllSeries(type) {
    console.log(`\nProcessing type: ${type}`);
    const promptSet = imagePrompts[type];
    
    if (!promptSet) {
        throw new Error(`Unknown type: ${type}`);
    }

    if (promptSet.prompt) {
        // 단일 프롬프트 타입 (예: history-hero)
        console.log(`Generating single series for ${type}`);
        await generateSeries(type, 1);
    } else {
        // 다중 시리즈 타입 (예: vision-card-1, vision-card-2, etc.)
        const seriesCount = Object.keys(promptSet).length;
        console.log(`Found ${seriesCount} series for ${type}`);
        
        for (let i = 1; i <= seriesCount; i++) {
            await generateSeries(type, i);
        }
    }
}

// 메인 실행 함수
async function main() {
    try {
        const args = process.argv.slice(2);
        const type = args[0];
        const series = args[1];

        if (type && series) {
            // 특정 시리즈만 생성 (예: vision-card 2)
            await generateSeries(type, series);
        } else if (type) {
            // 특정 타입의 모든 시리즈 생성
            await generateAllSeries(type);
        } else {
            // 모든 타입의 모든 시리즈 생성
            console.log('Generating all images...');
            for (const type of Object.keys(imagePrompts)) {
                await generateAllSeries(type);
            }
        }
        
        console.log('\nImage generation completed!');
    } catch (error) {
        console.error('\nError in main execution:', error);
        process.exit(1);
    }
}

// 스크립트 실행
if (require.main === module) {
    main().catch(console.error);
}

module.exports = {
    generateSeriesImage,
    generateSeries,
    generateAllSeries
}; 