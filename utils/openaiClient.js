const axios = require('axios');
const marketingPrompt = require('../prompts/marketing');
const translationPrompt = require('../prompts/translation');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class OpenAIClient {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.client = axios.create({
            baseURL: 'https://api.openai.com',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        this.previousResponses = new Set();
        this.supportedLanguages = {
            'en': 'English',
            'de': 'German',
            'fr': 'French',
            'ja': 'Japanese',
            'zh': 'Chinese'
        };
    }

    cleanJsonString(str) {
        // 1. 백틱과 'json' 태그 제거
        let cleaned = str.replace(/^```json\s*/, '').replace(/```$/, '');
        
        // 2. HTML 태그 정규화
        cleaned = cleaned.replace(/<Strong>/g, '<strong>');
        cleaned = cleaned.replace(/<\/Strong>/g, '</strong>');
        cleaned = cleaned.replace(/<i>|<\/i>/g, '');  // 이탤릭체 태그 제거
        
        // 3. class 속성을 가진 span 태그 정리
        cleaned = cleaned.replace(/<span[^>]*class="[^"]*"[^>]*>/g, '<span>');
        
        // 4. 연속된 <br> 태그를 하나로 통일
        cleaned = cleaned.replace(/(<br>[\s]*){2,}/g, '<br>');
        
        // 5. 줄바꿈과 불필요한 공백 정리
        cleaned = cleaned.replace(/\n\s*/g, '');
        cleaned = cleaned.replace(/\s+/g, ' ');
        
        // 6. HTML 태그 내부의 공백 보존
        cleaned = cleaned.replace(/(<br>)\s+/g, '$1');
        cleaned = cleaned.replace(/(<\/strong>)\s+/g, '$1');
        cleaned = cleaned.replace(/(<\/span>)\s+/g, '$1');
        cleaned = cleaned.replace(/\s+(<\/?(?:strong|span|br)>)/g, '$1');
        cleaned = cleaned.replace(/(<\/?(?:strong|span|br)>)\s+/g, '$1');
        
        // 7. 한글 텍스트 공백 처리
        // 한글 사이의 필요한 공백은 유지
        cleaned = cleaned.replace(/([가-힣])\s+([가-힣])/g, (match, p1, p2) => {
            // 특정 조사나 접속사 앞뒤의 공백은 유지
            const particles = ['은', '는', '이', '가', '을', '를', '의', '와', '과', '로', '으로'];
            if (particles.some(p => p2.startsWith(p)) || particles.some(p => p1.endsWith(p))) {
                return `${p1} ${p2}`;
            }
            return p1 + p2;
        });
        
        // 8. 속성 이름에 큰따옴표 추가
        cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_-]+):/g, '$1"$2":');
        
        // 9. 마지막 쉼표와 공백 처리
        cleaned = cleaned.replace(/,\s*}/g, '}');
        
        // 10. 모든 따옴표를 큰따옴표로 통일
        cleaned = cleaned.replace(/'/g, '"');
        cleaned = cleaned.replace(/'/g, '"');  // 스마트 따옴표 처리
        cleaned = cleaned.replace(/'/g, '"');
        
        // 11. 불필요한 공백 제거
        cleaned = cleaned.replace(/"\s+/g, '"');
        cleaned = cleaned.replace(/\s+"/g, '"');
        cleaned = cleaned.replace(/\s+,/g, ',');
        cleaned = cleaned.replace(/,\s+/g, ',');
        
        // 12. 문자열 내부의 연속된 공백을 단일 공백으로 변경
        cleaned = cleaned.replace(/(?<=")[^"]*(?=")/g, match => 
            match.replace(/\s+/g, ' ').trim()
        );
        
        return cleaned;
    }

    async loadPreviousResponse(index) {
        try {
            const filePath = path.join(process.cwd(), 'lang', 'ko', `random-${index}.json`);
            const content = await fs.readFile(filePath, 'utf8');
            return content;
        } catch (error) {
            return null;
        }
    }

    async generateMarketingContent(index) {
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // 이전 응답 로드
                const previousContent = await this.loadPreviousResponse(index - 1);
                
                // 시스템 프롬프트에 이전 응답 추가
                let systemPrompt = marketingPrompt;
                if (previousContent) {
                    systemPrompt += `\n\n이전에 생성된 콘텐츠와는 다른 표현을 사용해주세요. 이전 콘텐츠:\n${previousContent}`;
                }

                // 프롬프트에 제약조건 추가
                systemPrompt += `\n\n주의사항:
                1. HTML 태그는 <strong>, <br>, <span>만 사용하세요.
                2. 모든 텍스트는 한글과 영문만 사용하세요.
                3. 특수문자는 사용하지 마세요.
                4. JSON 형식을 정확히 지켜주세요.`;

                const response = await this.client.post('v1/chat/completions', {
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: "위의 가이드라인에 따라 새로운 마케팅 콘텐츠를 생성해주세요."
                        }
                    ],
                    temperature: 0.8 + (index * 0.05),
                    presence_penalty: 0.3,
                    frequency_penalty: 0.3,
                    max_tokens: 1000
                });

                const content = response.data.choices[0].message.content;
                const cleanContent = this.cleanJsonString(content);

                // 응답 검증
                if (this.validateResponse(cleanContent)) {
                    const parsedContent = JSON.parse(cleanContent);
                    return JSON.stringify(parsedContent, null, 2);
                } else {
                    throw new Error('Response validation failed');
                }
            } catch (error) {
                if (error.response) {
                    console.error(`Attempt ${attempt} - Error response:`, error.response.data);
                }
                console.error(`Attempt ${attempt} - Error generating marketing content:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // 다음 시도 전에 대기
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log(`Retrying... (Attempt ${attempt + 1}/${maxRetries})`);
            }
        }
    }

    validateResponse(content) {
        // 1. 허용되지 않는 HTML 태그 검사
        const invalidTags = content.match(/<(?!(?:strong|br|span|\/strong|\/br|\/span))[^>]+>/g);
        if (invalidTags) {
            console.error('Invalid HTML tags found:', invalidTags);
            return false;
        }

        // 2. 특수문자 검사 (허용된 것 제외)
        const invalidChars = content.match(/[^가-힣a-zA-Z0-9\s\{\}\[\]"':,.<>\/\-_]/g);
        if (invalidChars) {
            console.error('Invalid characters found:', invalidChars);
            return false;
        }

        // 3. JSON 구조 검사
        try {
            const parsed = JSON.parse(content);
            const requiredKeys = [
                'random-vision-text',
                'vision-card-random-text-1',
                'vision-card-random-text-2',
                'vision-card-random-text-3',
                'vision-card-random-text-4',
                'index-hero-title-random-keyword1',
                'index-hero-title-random-keyword2',
                'index-hero-random-description',
                'index-introduce-random-description',
                'index-card-introduce-random-description',
                'index-collaboration-random-description',
                'technology-hero-random-description',
                'news-highlight-random-description',
                'history-content-random-title'
            ];

            const hasAllKeys = requiredKeys.every(key => key in parsed);
            if (!hasAllKeys) {
                console.error('Missing required keys in response');
                return false;
            }

            return true;
        } catch (error) {
            console.error('JSON validation error:', error);
            return false;
        }
    }

    async generateImage(prompt) {
        try {
            const response = await this.client.post('v1/images/generations', {
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                response_format: "b64_json"
            });

            return response.data.data[0].b64_json;
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            console.error('Error generating image:', error.message);
            throw error;
        }
    }

    async withRetry(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
            }
        }
    }

    async translateContent(content, targetLang) {
        try {
            const langName = this.supportedLanguages[targetLang];
            const response = await this.client.post('v1/chat/completions', {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: translationPrompt
                    },
                    {
                        role: "user",
                        content: `Translate the following JSON content into ${langName}:\n\n${content}`
                    }
                ],
                temperature: 0.3,  // 번역은 낮은 temperature로 정확성 유지
                max_tokens: 1500
            });

            const translatedContent = response.data.choices[0].message.content;
            const cleanContent = this.cleanJsonString(translatedContent);

            // 번역 결과 검증
            if (this.validateTranslation(cleanContent)) {
                return cleanContent;
            } else {
                throw new Error('Translation validation failed');
            }
        } catch (error) {
            if (error.response) {
                console.error('Translation error response:', error.response.data);
            }
            console.error('Error translating content:', error.message);
            throw error;
        }
    }

    validateTranslation(content) {
        // 1. 허용되지 않는 HTML 태그 검사
        const invalidTags = content.match(/<(?!(?:strong|br|span|\/strong|\/br|\/span))[^>]+>/g);
        if (invalidTags) {
            console.error('Invalid HTML tags found:', invalidTags);
            return false;
        }

        // 2. 특수문자 검사 (각 언어의 문자와 문장 부호 허용)
        const allowedChars = new RegExp(
            '^[' +
            '\\p{L}\\p{N}\\s' +  // 문자, 숫자, 공백
            '\\{\\}\\[\\]"\':\\.,<>\\/-_&;' +  // JSON, HTML 관련 문자
            '。、，．' +  // 일본어/중국어 문장 부호
            '「」『』（）｛｝［］' +  // 일본어/중국어 괄호
            '"\'""\'\'' +
            ']+$',
            'u'
        );
        
        if (!allowedChars.test(content)) {
            const invalidChars = content.match(new RegExp(
                '[^' +
                '\\p{L}\\p{N}\\s' +
                '\\{\\}\\[\\]"\':\\.,<>\\/-_&;' +
                '。、，．' +
                '「」『』（）｛｝［］' +
                '"\'""\'\'' +
                ']',
                'gu'
            ));
            console.error('Invalid characters found:', [...new Set(invalidChars)]);
            return false;
        }

        // 3. JSON 구조 검사
        try {
            const parsed = JSON.parse(content);
            const requiredKeys = [
                'random-vision-text',
                'vision-card-random-text-1',
                'vision-card-random-text-2',
                'vision-card-random-text-3',
                'vision-card-random-text-4',
                'index-hero-title-random-keyword1',
                'index-hero-title-random-keyword2',
                'index-hero-random-description',
                'index-introduce-random-description',
                'index-card-introduce-random-description',
                'index-collaboration-random-description',
                'technology-hero-random-description',
                'news-highlight-random-description',
                'history-content-random-title'
            ];

            const hasAllKeys = requiredKeys.every(key => key in parsed);
            if (!hasAllKeys) {
                console.error('Missing required keys in response');
                return false;
            }

            // 추가: 각 값이 문자열인지 확인
            const allValuesAreStrings = Object.values(parsed).every(value => typeof value === 'string');
            if (!allValuesAreStrings) {
                console.error('All values must be strings');
                return false;
            }

            return true;
        } catch (error) {
            console.error('JSON validation error:', error);
            return false;
        }
    }

    async translateToAllLanguages(sourceContent) {
        const translations = {};
        
        for (const [langCode, langName] of Object.entries(this.supportedLanguages)) {
            console.log(`Translating to ${langName}...`);
            try {
                const translated = await this.translateContent(sourceContent, langCode);
                translations[langCode] = translated;
                
                // 각 번역 사이에 1초 대기
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error translating to ${langName}:`, error.message);
            }
        }
        
        return translations;
    }
}

module.exports = new OpenAIClient();