// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock URL API if needed
global.URL = class URL {
  constructor(url) {
    this.url = url;
    this.pathname = url;
    this.origin = "http://localhost";
    this.hash = "";
    this.hostname = "localhost";
  }
};

// Mock window.location
const mockLocation = new URL("http://localhost/");
delete window.location;
window.location = mockLocation;

// Mock history API
window.history.pushState = jest.fn();
