const logger = require('./logger');

/**
 * Retry an async operation with exponential backoff
 * @param {Function} operation - The async operation to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} baseDelay - Base delay in milliseconds (default: 1000)
 * @returns {Promise} - The result of the operation
 */
async function retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                logger.error(`Operation failed after ${maxRetries} retries:`, error);
                throw error;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            logger.warn(`Operation failed, retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
}

module.exports = {
    retryOperation
}; 