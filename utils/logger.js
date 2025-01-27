const winston = require('winston');
const path = require('path');
const fs = require('fs').promises;

// 로그 디렉토리 경로 정의
const logDir = path.join(__dirname, '../logs');

// 로그 디렉토리 생성
async function ensureLogDirectory() {
    try {
        await fs.access(logDir);
    } catch {
        await fs.mkdir(logDir);
    }
}

// 초기화 시 로그 디렉토리 생성
ensureLogDirectory().catch(console.error);

// 로그 포맷 정의
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// 로거 설정
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'human-plus-web' },
    transports: [
        // 에러 레벨 로그는 별도 파일로 저장
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // 모든 레벨의 로그를 저장
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // 개발 환경에서는 콘솔에도 출력
        ...(process.env.NODE_ENV !== 'production' ? [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        ] : [])
    ]
});

// 로그 레벨별 메소드 정의
module.exports = {
    error: (message, meta = {}) => {
        logger.error(message, meta);
    },
    warn: (message, meta = {}) => {
        logger.warn(message, meta);
    },
    info: (message, meta = {}) => {
        logger.info(message, meta);
    },
    debug: (message, meta = {}) => {
        logger.debug(message, meta);
    },
    // 스케줄러 전용 로그
    scheduler: {
        start: (taskName) => {
            logger.info(`Scheduler task started: ${taskName}`, { type: 'scheduler', task: taskName });
        },
        complete: (taskName) => {
            logger.info(`Scheduler task completed: ${taskName}`, { type: 'scheduler', task: taskName });
        },
        error: (taskName, error) => {
            logger.error(`Scheduler task failed: ${taskName}`, { 
                type: 'scheduler', 
                task: taskName,
                error: error.message,
                stack: error.stack
            });
        }
    },
    // API 호출 로그
    api: {
        request: (method, endpoint) => {
            logger.debug(`API Request: ${method} ${endpoint}`, { type: 'api', method, endpoint });
        },
        response: (method, endpoint, status) => {
            logger.debug(`API Response: ${method} ${endpoint} - Status: ${status}`, { 
                type: 'api', 
                method, 
                endpoint, 
                status 
            });
        },
        error: (method, endpoint, error) => {
            logger.error(`API Error: ${method} ${endpoint}`, { 
                type: 'api', 
                method, 
                endpoint, 
                error: error.message,
                stack: error.stack
            });
        }
    }
}; 