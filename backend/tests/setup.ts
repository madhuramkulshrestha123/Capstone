// Jest setup file for tests
import { jest } from '@jest/globals';

// Set environment to test
process.env.NODE_ENV = 'test';

// Set default timeout for tests
jest.setTimeout(30000);