# Lightweight Router

A minimal lightweight client-side router with intelligent prefetching capabilities for faster websites.

## Features

- 🚀 Zero dependencies
- 🔄 Smooth client-side navigation
- 📥 Intelligent link prefetching
- 🎯 Multiple prefetching strategies
- 🔍 SEO-friendly
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
