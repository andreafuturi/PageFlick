# Lightweight Router

A minimal lightweight client-side router with intelligent prefetching capabilities for faster websites. This tool can turn any Multi-Page Application (MPA) into a Single-Page Application (SPA) very easily and with just ~1.5KB byte (gzipped).

## Features

- 🚀 Zero dependencies
- 🔄 Smooth client-side navigation
- 📥 Intelligent link prefetching
- 🎯 Multiple prefetching strategies
- 🔍 SEO-friendly (works with Wordpress)
- 📱 Mobile-friendly with data-saver mode support
- 🎨 Built-in loading animations

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
import { startRouter } from 'lightweight-router';

startRouter({
  onRouteChange: (currentRoute) => {
    console.log('Route changed:', currentRoute);
  },
});
```

### Direct Import

You can also directly import the minified version of the router in your HTML file or paste its content inside a script tag:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
</head>
<body>
  <!-- Your website content -->
  <script src="path/to/dist/router.min.js"></script>
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
    import { startRouter } from './router.js';

    startRouter({
      onRouteChange: (currentRoute) => {
        console.log('Route changed:', currentRoute);
      },
    });
  </script>
```

## Server Configuration
Configuring your server to return only the route content can make the router much more efficient. Instead of returning the entire page, the server should return only the content for the requested route when it detects a request with the message "onlyRoute".

```javascript
await fetch(url, { method: "POST", body: "onlyRoute" });
```

 This allows only the changing part of the document to be updated, improving performance and reducing bandwidth usage. 

Once you configured your server to respond to this type of request, wrap the part of your document that changes in a `router` tag. Inside the `router` tag, render the current initial route inside a `route` tag like this:

```html
<-- Header menu and parts that don't change -->
<router>
  <route path="/" style="content-visibility: auto">home content</route>
</router>
<-- footer etc.. -->
```

You can also prerender other important routes by rendering them inside the `router` tag in their appropriate `route` tags for faster loading times:

```html
<router>
  <route path="/" style="content-visibility: auto">home content</route>
  <route path="/about" style="content-visibility: auto; display:none;">about content</route>
</router>
```

In the future you will also be able to pre-render a default route that will be used as 404 by having it at /404 or /default

Right now errors are shown without styling as the content of the page.

Soon there will be a DenoJS library that will help you deal with all these routes stuff. It will also come with api routes functionality 🔥

## Prefetching

By default, links are prefetched when they get in the user's screen using an `IntersectionObserver`. This ensures that the content is loaded in the background before the user clicks on the link, providing a smoother navigation experience.

If you have too many links at once or too many requests, you can add the `prefetch="onHover"` attribute to your links or some of them (usually links to huge pages that are not often visited):

```html
<a href="/archive" prefetch="onHover">Archive</a>
```


P.S. you can easily test in your website by pasting this minified version into the console.


The minified version was created with uglify-js, clean.css and then minified again with https://packjs.com
The size of the gzipped version was calculated with: https://dafrok.github.io/gzip-size-online/
It's worth to note that nonethewise Terser give better results than uglify-js. The final uglify version packed by packjs.com was even smaller.


