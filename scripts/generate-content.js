const fs = require('fs');
const path = require('path');
const openaiClient = require('../utils/openaiClient');

async function generateAndSaveContent() {
    try {
        for (let i = 1; i <= 6; i++) {
            console.log(`Generating content for random-${i}.json...`);
            const content = await openaiClient.generateMarketingContent(i);
            console.log('Content generated successfully');
            
            const parsedContent = JSON.parse(content);
            const outputPath = path.join('lang', 'ko', `random-${i}.json`);
            
            fs.writeFileSync(outputPath, JSON.stringify(parsedContent, null, 2), 'utf8');
            console.log(`Content saved to ${outputPath}`);
            
            // Wait for 2 seconds between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

generateAndSaveContent(); 