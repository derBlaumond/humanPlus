const openaiClient = require('../utils/openaiClient');
const { jest: jestGlobal } = require('@jest/globals');

describe('OpenAI Client', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('generateMarketingContent', () => {
        test('should generate valid marketing content', async () => {
            const mockContent = {
                "random-vision-text": "혁신을 향한 끊임없는 도전",
                "vision-card-random-text-1": "글로벌 기술 혁신 선도",
                "index-hero-random-description": "Human Plus는<br>세계적 기술력으로<br>미래를 선도합니다"
            };

            const mockResponse = {
                data: {
                    choices: [{
                        message: {
                            content: JSON.stringify(mockContent)
                        }
                    }]
                }
            };

            jest.spyOn(openaiClient.client, 'post').mockResolvedValue(mockResponse);

            const result = await openaiClient.generateMarketingContent();
            const parsedResult = JSON.parse(result);

            expect(parsedResult).toHaveProperty('random-vision-text');
            expect(parsedResult).toHaveProperty('vision-card-random-text-1');
            expect(parsedResult).toHaveProperty('index-hero-random-description');
            expect(parsedResult['random-vision-text']).toBe(mockContent['random-vision-text']);
        });

        test('should handle API errors gracefully', async () => {
            jest.spyOn(openaiClient.client, 'post').mockRejectedValue(new Error('API Error'));

            await expect(openaiClient.generateMarketingContent()).rejects.toThrow('API Error');
        });
    });

    describe('generateImage', () => {
        test('should generate base64 image', async () => {
            const mockResponse = {
                data: {
                    data: [{
                        b64_json: 'base64_encoded_image_data'
                    }]
                }
            };

            jest.spyOn(openaiClient.client, 'post').mockResolvedValue(mockResponse);

            const result = await openaiClient.generateImage('test prompt');
            expect(result).toBe('base64_encoded_image_data');
        });

        test('should handle image generation errors', async () => {
            jest.spyOn(openaiClient.client, 'post').mockRejectedValue(new Error('Image Generation Error'));

            await expect(openaiClient.generateImage('test prompt')).rejects.toThrow('Image Generation Error');
        });
    });
}); 