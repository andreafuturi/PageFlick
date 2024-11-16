const fs = require("fs");
const path = require("path");
const uglifyJS = require("uglify-js");
const CleanCSS = require("clean-css");

// Read the router source
const routerSource = fs.readFileSync(path.join(__dirname, "src/router.js"), "utf8");

// Extract CSS from the source
const cssRegex = /style\.textContent = `\s*([\s\S]*?)\s*`;/;
const cssMatch = routerSource.match(cssRegex);
const css = cssMatch ? cssMatch[1] : "";

// Minify CSS
const minifiedCSS = new CleanCSS({}).minify(css).styles;

// Replace original CSS with minified version
const updatedSource = routerSource.replace(cssRegex, `style.textContent = '${minifiedCSS}';`);

// Convert ES module to self-initializing IIFE
const iife = `
(function() {
  ${updatedSource.replace("export { startRouter };", "")}
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => startRouter());
  } else {
    startRouter();
  }
})();
`;

// Minify the JavaScript
const minified = uglifyJS.minify(iife);

if (minified.error) {
  console.error("Minification error:", minified.error);
  process.exit(1);
}

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Write minified file
fs.writeFileSync(path.join(distDir, "router.min.js"), minified.code);

console.log("Build complete! Output saved to dist/router.min.js");
