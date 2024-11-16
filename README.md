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
