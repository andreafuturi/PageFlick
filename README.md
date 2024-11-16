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