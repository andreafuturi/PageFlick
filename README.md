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
- 📜 Scroll route sections with automatic URL/title updates


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

startRouter()

//or with your callback

startRouter({
  onRouteChange: currentRoute => {
    console.log("Route changed:", currentRoute);
  },
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
  - `onRouteChange` (Function): Callback function to be called when the route changes.

## Examples

### Basic Example

```html
Your website content
<script type="module">
  import { startRouter } from "./router.js";

  startRouter({
    onRouteChange: currentRoute => {
      console.log("Route changed:", currentRoute);
    },
  });
</script>
```

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
<-- Header menu and parts that don't change -->
<router>
  <route path="/">home content</route>
</router>
<-- footer etc.. -->
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

## Scroll Routes

The `scroll` attribute on a `<route>` marks it as a scrollable section. Scroll routes are stacked vertically and always visible when in scroll-route context. Clicking a link to a scroll route smooth-scrolls to that section. As the user scrolls, the URL and page title update automatically to reflect the visible section.

Use an optional `<title>` tag inside a scroll route to set the document title when that section is in view.

```html
<router>
  <route path="/" scroll>
    <title>Home | My Site</title>
    <section style="min-height: 100vh">Hero content</section>
  </route>
  <route path="/features" scroll>
    <title>Features | My Site</title>
    <section style="min-height: 100vh">Features content</section>
  </route>
  <route path="/pricing" scroll>
    <title>Pricing | My Site</title>
    <section style="min-height: 100vh">Pricing content</section>
  </route>
</router>
```

You can mix scroll routes and regular routes. When navigating to a regular route, scroll routes are hidden. When navigating to a scroll route, regular routes are hidden and all scroll sections are visible.

### Server configuration for direct URL access

When a user visits a scroll route URL directly (e.g. `/features`), the server must serve the page containing the scroll routes. Configure your server to serve the same HTML file for all scroll route paths:

**Nginx:**
```nginx
location ~ ^/(features|pricing)$ {
  try_files $uri /home.html;
}
```

**Express / Node.js:**
```javascript
app.get(["/", "/features", "/pricing"], (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});
```

**Vite / static dev servers:** Use a rewrite rule or `_redirects` file (Netlify/Vercel):
```
/features   /home.html  200
/pricing    /home.html  200
```

## Future Development
- Delay router intialization on first link hover for better performances?
- Implement html streaming for faster page load
- Cooler Error handling
- Disable caching on certain links/routes (that needs to be always up to date)
- Cache limiting






