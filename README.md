# Lightweight Router

A minimal lightweight client-side router with intelligent prefetching capabilities for faster websites. This tool can turn any Multi-Page Application (MPA) into a Single-Page Application (SPA) very easily and with just 1597 byte (gzipped).

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

## Prefetching

By default, links are prefetched when they get in the user's screen using an `IntersectionObserver`. This ensures that the content is loaded in the background before the user clicks on the link, providing a smoother navigation experience.

If you have too many links at once or too many requests, you can add the `prefetch="onHover"` attribute to your links or some of them (usually links to huge pages that are not often visited):

```html
<a href="/archive" prefetch="onHover">Archive</a>
```


P.S. you can easily test in your website by pasting this minified version into the console:

```javascript
$="(£ì­c={},n=async£ìÜµ¨¢t=êð;­¦úè(`ä[pÓh=${t}]`÷n=(oÊ((o´êð÷ú½(o)÷Æç.addöÛ³¼nÊ(n=×d(êó³=n¼Ür,a=(ÍDOMParsõ).parseF°mString(n,ýxt/html¢i=a.èötàle¢i=(iÞ(¾tàlµi.Ý÷¥î=a.¬.î,Array.f°m(¥¹Éé)¼for(r of i){Ül=ßÉé;r«?l«=r«:l.Ý=r.Ý,r.paùïNodÐChild(l,rØú¹äé.fÔ=>ú²nëeé÷¥²c¡sÑÆç.ùmo·öÛ¢Ïsc°llTo(0,0÷sÞs(tØ,r=âËÊ(Ë=×dªØ,a=ô,t)ìúfÔìúisIÀngÞôí,ËÊ(rô÷Õun®))±Ø,i=eìÜtí.closeçöAé;tÞÕóÞl(Õó)ÞÕÈÒ=lüÈÞ(úpù·ïDefault(ºhiçory.pushStaý(¸¸ÕóºdispÓchE·ï(ÍE·ïö¯é)Ø;functië lô){ifô©#é©javaÉ:é){ Öhö/é)á1;try{Üt=ÍURLô,ÏlüÈ÷¦ÍURL(Ïlüó¼á¥¤Ò=Õ¤?¥ð!ÒÕðÊ!Õhash:void 0}cÓch{}}}­s,d=âµ×tô¼áúok?úýxt£:Couldn't Ì the ä - HTTP õ°r! çÓus: +úçÓus},t=â !h){Üt=×Ìô,{mÚhod:POSTÑ¬:ëlyRouý}¼ Õok)át}áÌôØ,h=!1,µô={})ìÜt,µúëRouýChange,µôÞô=e,s=e÷ßçyleé÷µ(úÝ=¬.Û{animÓië:¶ 1s infiniý alýrnaý}@keyframes ¶{f°m§8}to§3}}Ñ¾head.½ô÷¨é÷¦êð,¦ôÊô=ßär¢(t´o÷Õçylúc¡Visibilày=autoÑÕî=òî,ú½(t÷òî=Ñò½ô÷h=!0ºÙ¯Ñn÷¾ÙclickÑi÷òÙmouseovõÑôìAÒí.tagNameÞ»í.¿Þ(âeí;!ËÞlªÞ×rô±ô±÷ÍIÀëObsõvõ(a,{°ot:¸thùshold:.5})¼(tì­¦naÁÞnaÁ.sa·DÓa;¾¹aé.fÔì»=ú¿ÊoÊlªÊÕ®±±(oØ;ÛÒ=¾ùadyStaý?¾ÙDOMC¡LoadedÑ(£=>e£)):e(±(¼";l="if(ëýï÷()hoÂéo.o={oÎ:.¾èöärÞ!Öhö(úó).srcbodylÚ obsõ·ôpopçaýroØ)çylÇ=÷c[êó]=ßäÅÓhÑe=pulseOÎvenull,èAllö÷glû.ëHovõÒ);aãlddþgÚAåpùÌénýrsectivigÃctiëÄwww./,Óor.cëneçnamÐ(/^é).sÚAåpòclassLiúdisplayoriginscript||c[úó]fÚchnew pacàywindow.úùplace,==atorEach(ôt.úçartsWàawaà )}addEveæetloadingvar ýxtCëýï&&dñmeïöitùturn async eìppendChirouýttribuýöïLisýnõöstquõør)glû.lüon=>{=útargetinnõHTMLntpathnameþcùaýEledþbody.hùf(eer(),ySelectoree.obalThisocation.teocument.".split('');_=" ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþ";for(i=0;i<95;i++){$=$.split(_[i]).join(l[i])};eval($.replace(//g,'"').replace(//g,'\\').replace(//g,String.fromCharCode(10)));
```

The minified version was created with uglify-js, clean.css and then minified again with https://packjs.com
The size of the gzipped version was calculated with: https://dafrok.github.io/gzip-size-online/
It's worth to note that nonethewise Terser give better results than uglify-js. The final uglify version packed by packjs.com was even smaller.


