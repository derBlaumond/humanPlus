const express = require('express');
const { scheduler } = require('../utils/scheduler');
const logger = require('../utils/logger');

const schedulerRouter = express.Router();

/**
 * @route POST /api/scheduler/run
 * @description 스케줄러 수동 실행
 */
schedulerRouter.post('/run', async (req, res) => {
    try {
        logger.api.request('POST', '/api/scheduler/run');
        
        await scheduler.runUpdates();
        
        logger.api.response('POST', '/api/scheduler/run', 200);
        res.status(200).json({
            success: true,
            message: 'Scheduler tasks executed successfully'
        });
    } catch (error) {
        logger.api.error('POST', '/api/scheduler/run', error);
        res.status(500).json({
            success: false,
            message: 'Failed to execute scheduler tasks',
            error: error.message
        });
    }
});

/**
 * @route GET /api/scheduler/status
 * @description 스케줄러 상태 확인
 */
schedulerRouter.get('/status', (req, res) => {
    try {
        logger.api.request('GET', '/api/scheduler/status');
        
        const status = {
            schedule: scheduler.schedule,
            lastRun: scheduler.lastRun,
            nextRun: scheduler.getNextRunTime(),
            isRunning: scheduler.isRunning
        };
        
        logger.api.response('GET', '/api/scheduler/status', 200);
        res.status(200).json({
            success: true,
            status
        });
    } catch (error) {
        logger.api.error('GET', '/api/scheduler/status', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get scheduler status',
            error: error.message
        });
    }
});

module.exports = schedulerRouter; 