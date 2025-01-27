const axios = require('axios');
const { retryOperation } = require('./retryHelper');
const marketingPrompt = require('../prompts/marketing');
const translationPrompt = require('../prompts/translation');
const logger = require('./logger');
require('dotenv').config();

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async generateText(prompt, preserveTags = false) {
        try {
            const response = await retryOperation(async () => {
                return await this.client.post('/chat/completions', {
                    model: "gpt-4",
                    messages: [{
                        role: "system",
                        content: marketingPrompt
                    }, {
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7
                });
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Text generation failed:', error);
            throw error;
        }
    }

    async translateText(text, targetLang) {
        try {
            const response = await retryOperation(async () => {
                return await this.client.post('/chat/completions', {
                    model: "gpt-4",
                    messages: [{
                        role: "system",
                        content: translationPrompt(targetLang)
                    }, {
                        role: "user",
                        content: text
                    }],
                    temperature: 0.3
                });
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Translation failed:', error);
            throw error;
        }
    }

    async generateImage(prompt) {
        try {
            const operation = async () => {
                const response = await this.client.post('/v1/images/generations', {
                    prompt,
                    n: 1,
                    size: '1024x1024',
                    response_format: 'b64_json'
                });
                return response.data.data[0].b64_json;
            };

            return await retryOperation(operation);
        } catch (error) {
            logger.error('Image generation failed:', error);
            throw error;
        }
    }
}

module.exports = new ApiClient();