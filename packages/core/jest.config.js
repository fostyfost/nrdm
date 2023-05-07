/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  testEnvironment: 'jsdom',
}

module.exports = config
