# PageFlick

PageFlick is a minimal lightweight client-side router with intelligent prefetching capabilities for faster websites. This tool can turn any Multi-Page Application (MPA) into a Single-Page Application (SPA) very easily and with just ~1.5KB byte (gzipped).

## Features

- 🚀 Zero dependencies
- 🔄 Smooth client-side navigation
- 📥 Intelligent link prefetching
- 🎯 Multiple prefetching strategies
- 🔍 SEO-friendly (works with Wordpress)
- 📱 Mobile-friendly with data-saver mode support
- 🎨 Built-in loading animations
- 🕰️ Based on History API so you can use native browser navigation
- 🤖 Automatic title change
- 📜 **Scroll routes** — multi-section landing pages: full-height `<route scroll>` blocks, smooth in-page navigation, and URL bar sync while scrolling

## Installation

### NPM

```sh
npm install lightweight-router
```

## Usage

To use the lightweight router in your project, follow these steps:

1. Import the `startRouter` function from the router module.
2. Call the `startRouter` function to initialize the router.

Example:

```javascript
import { startRouter } from "lightweight-router";

startRouter();

//or with your callback

startRouter({
  onRouteChange: path => {
    console.log("Route changed:", path);
  },
  debug: true, // optional: log router activity to the console
});
```

### Direct Import

You can also directly import the minified version of the router in your HTML file or paste its content inside a script tag:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <!-- Your website content -->
    <script src="path/to/router.ultramin.js"></script>
  </body>
</html>
```

## API

### `startRouter(options)`

Initializes the router with the given options.

#### Parameters

- `options` (Object): Configuration options for the router.
  - `onRouteChange` (Function): Called with the **current path string** when the route changes (including when the URL is updated while scrolling through scroll routes).
  - `debug` (Boolean): When `true`, logs navigation and prefetch activity to the console.

## Examples

### Basic Example

```html
Your website content
<script type="module">
  import { startRouter } from "./router.js";

  startRouter({
    onRouteChange: path => {
      console.log("Route changed:", path);
    },
  });
</script>
```

See **`src/index.html`** in this repo for a full **scroll routes** landing example (`<route scroll>` sections and nav).

## Prefetching

By default, links are prefetched when they get in the user's screen using an `IntersectionObserver`. This ensures that the content is loaded in the background before the user clicks on the link, providing a smoother navigation experience.
This behaviour is automatically disabled if the user has data saving preferences.

If you have too many links at once or too many requests, you can add the `prefetch="onHover"` attribute to your links or some of them (usually links to huge pages that are not often visited):

```html
<a href="/archive" prefetch="onHover">Archive</a>
```

P.S. you can easily test in your website by pasting the ultra minified version into the console.
The minified version was created with uglify-js, clean.css and then ultra minified with https://packjs.com
The size of the gzipped version was calculated with: https://dafrok.github.io/gzip-size-online/
It's worth to note that nonetheless Terser give better results than uglify-js. The final uglify version packed by packjs.com was the smallest.

## Scroll routes (landing sections)

Use this for a **single HTML page** that behaves like several “routes”: tall sections that share one document, each with its own pathname. Mark sections with **`scroll`** on `<route>` and a **`path`** that matches the URL you want in the address bar.

```html
<router>
  <route scroll path="/">
    <!-- hero -->
  </route>
  <route scroll path="/features">
    <!-- features -->
  </route>
  <route scroll path="/pricing.html">
    <!-- pricing -->
  </route>
</router>
```

**Behavior**

- When the current URL matches a **`route[scroll]`** `path`, all scroll routes are shown (non-scroll routes inside `<router>` are hidden), and the matching section is scrolled into view. Internal links to another scroll route use **smooth** scrolling.
- While the user scrolls, an **IntersectionObserver** picks the most visible section and updates the URL with **`history.replaceState`** (and fires `onRouteChange`) so the address bar tracks the section in view.
- Empty scroll routes still **fetch** HTML from the server like normal routes (prefetching applies the same way).
- **Deep links**: opening `/features` directly only works if your static server **falls back to this HTML** for unknown paths (for example `npx serve . --single`).

## Browser Support

The router is intended for modern browsers. Required features:

- IntersectionObserver
- Fetch API
- History API

For older browsers, consider using the following polyfills:

- intersection-observer
- whatwg-fetch

## Optional Server Configuration

Configuring your server to return only the route content can make the router much more efficient. Instead of returning the entire page, the server could return only the content for the requested route when it detects a request with the message "onlyRoute".

```javascript
await fetch(url, { method: "POST", body: "onlyRoute" });
```

This allows only the changing part of the document to be updated, improving performance and reducing bandwidth usage.

Once you configured your server to respond to this type of request, wrap the part of your document that changes in a `router` tag. Inside the `router` tag, render the current initial route inside a `route` tag like this:

```html
<!-- Header menu and parts that don't change -->
<router>
  <route path="/">home content</route>
</router>
<!-- footer etc.. -->
```

You can also prerender most visited routes by rendering them inside the `router` tag in their appropriate `route` tags for faster loading times:

```html
<router>
  <route path="/">home content</route>
  <route path="/about" style="display:none;">about content</route>
</router>
```

In the future you will also be able to pre-render a default route that will be used as 404 by having it at /404 or /default

Right now errors are shown without styling as the content of the page.

If you like to use Preact and Deno for easy server config consider using the server side router present in [Singularity](https://github.com/andreafuturi/Singularity/) framework.
It does exactly what we're talking about automatically by returning full html renders on normal request (sorrounded by an Index.jsx) and returing only partial route html when route is requested from inside the page (with onlyRoute param).

## Performance Tips

- Implement server-side partial responses for better bandwidth usage
- Consider using the `prefetch="onHover"` attribute for less important links

## Future Development

- Delay router intialization on first link hover for better performances?
- Implement html streaming for faster page load
- Cooler Error handling
- Disable caching on certain links/routes (that needs to be always up to date)
- Cache limiting
