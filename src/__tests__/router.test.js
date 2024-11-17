/**
 * @jest-environment jsdom
 */

describe("Router", () => {
  beforeEach(async () => {
    // Setup a clean DOM environment before each test
    document.body.innerHTML = `
      <div>
        <h1>Test Page</h1>
        <a href="/about">About</a>
        <a href="/contact" prefetch="onHover">Contact</a>
      </div>
    `;

    // Mock fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("<div>New Content</div>"),
      })
    );

    // Load the router after DOM is set up
    require("../../dist/router.min.js");

    // Wait for next tick to allow router initialization
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear the require cache so we can reload the router in next test
    jest.resetModules();
  });

  test("initializes router and wraps existing content", async () => {
    const router = document.querySelector("router");
    const route = document.querySelector("route");

    expect(router).toBeTruthy();
    expect(route).toBeTruthy();
    expect(route.getAttribute("path")).toBe(window.location.pathname);
  });

  test("handles internal navigation", async () => {
    // Mock the window.location object
    delete window.location;
    window.location = new URL("http://localhost/");

    // Mock history.pushState to actually update the location
    const originalPushState = window.history.pushState;
    window.history.pushState = jest.fn((state, title, url) => {
      window.location = new URL(url, "http://localhost");
      originalPushState.call(window.history, state, title, url);
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const link = document.querySelector('a[href="/about"]');
    link.click();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(window.location.pathname).toBe("/about");
    expect(fetch).toHaveBeenCalledWith("/about", expect.any(Object));
  });

  test("prefetches content on hover for marked links", async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    const link = document.querySelector('a[prefetch="onHover"]');
    link.dispatchEvent(new MouseEvent("mouseover"));

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(fetch).toHaveBeenCalledWith("/contact", expect.any(Object));
  });

  test("updates document title when navigating", async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    // Mock fetch to return content with a title
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () =>
          Promise.resolve(`
          <html>
            <head>
              <title>New Page</title>
            </head>
            <body>
              <div>New Content</div>
            </body>
          </html>
        `),
      })
    );

    const link = document.querySelector('a[href="/about"]');
    link.click();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(document.title).toBe("New Page");
  });

  test("handles navigation errors gracefully", async () => {
    await new Promise(resolve => setTimeout(resolve, 0));

    // Mock fetch to simulate an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    const link = document.querySelector('a[href="/about"]');
    link.click();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    const route = document.querySelector('route[path="/about"]');
    expect(route.innerHTML).toContain("Couldn't fetch the route - HTTP error! status: 404");
  });

  test("considers paths with and without trailing slashes as the same route", async () => {
    // Mock the window.location object
    delete window.location;
    window.location = new URL("http://localhost/");

    // Mock history.pushState to actually update the location
    const originalPushState = window.history.pushState;
    window.history.pushState = jest.fn((state, title, url) => {
      window.location = new URL(url, "http://localhost");
      originalPushState.call(window.history, state, title, url);
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const linkWithSlash = document.createElement("a");
    linkWithSlash.href = "/about/";
    document.body.appendChild(linkWithSlash);
    linkWithSlash.click();

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(window.location.pathname).toBe("/about");
    expect(fetch).toHaveBeenCalledWith("/about", expect.any(Object));
  });
});
