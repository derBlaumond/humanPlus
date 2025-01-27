require('dotenv').config();

// Mock axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        post: jest.fn()
    }))
}));

// 전역 테스트 설정
process.env.NODE_ENV = 'test'; 