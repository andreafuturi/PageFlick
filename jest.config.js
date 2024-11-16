module.exports = {
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx"],
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "dist"],
};
