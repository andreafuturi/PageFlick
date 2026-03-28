let cache = {};
let debugMode = false;
let globalTitle = "";
const log = (...args) => debugMode && console.log("🚦 Router:", ...args);

const getTitle = (el, path) => {
  const tag = el?.querySelector("title");
  if (tag) return tag.textContent.split("|")[0].trim();
  const segment = path.replace(/\.html$/, "").split("/").filter(Boolean).pop();
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Home";
};

const showScrollRoutes = router => {
  router.querySelectorAll("route[scroll]").forEach(r => r.style.removeProperty("display"));
  router.querySelectorAll("route:not([scroll])").forEach(r => (r.style.display = "none"));
};

const handlePopState = async () => {
  log("Navigation triggered to:", globalThis.location.pathname);
  document.body.classList.add("loading");
  const currentPath = globalThis.location.pathname.replace(/\/$/, "") || "/"; // Normalize path, preserve root "/"
  const router = document.querySelector("router");

  let currentRoute = router.querySelector(`route[path="${currentPath}"]`);

  // Handle scroll route navigation — show all scroll routes and smooth-scroll to target
  if (currentRoute?.hasAttribute("scroll")) {
    showScrollRoutes(router);
    document.body.classList.remove("loading");
    currentRoute.scrollIntoView({ behavior: "smooth" });
    if (onRouteChange) onRouteChange(currentPath);
    log("Scroll route navigation completed");
    return;
  }

  if (!currentRoute) {
    currentRoute = document.createElement("route");
    currentRoute.setAttribute("path", currentPath);
    router.appendChild(currentRoute);
    log("Created route element for:", currentPath);
  }

  // Fetch and render on first visit
  if (!currentRoute.innerHTML) {
    log("Fetching content for:", globalThis.location.href);
    let content = cache[globalThis.location.href];

    // Fetch content if it's not already cached
    if (!content) {
      content = await fetchContent(globalThis.location.href);
      cache[globalThis.location.href] = content;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    currentRoute.dataset.routeTitle = getTitle(doc, currentPath);
    currentRoute.innerHTML = doc.body.innerHTML;

    // Execute scripts from the fetched content
    const scripts = Array.from(currentRoute.querySelectorAll("script"));
    log("Executing", scripts.length, "scripts from fetched content");
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.parentNode.replaceChild(newScript, oldScript);
    }
  }

  // Show current route, hide the rest
  router.querySelectorAll("route").forEach(route => (route.style.display = "none"));
  currentRoute.style.display = "contents";

  const routeLabel = currentRoute.dataset.routeTitle || getTitle(currentRoute, currentPath);
  document.title = globalTitle ? `${routeLabel} | ${globalTitle}` : routeLabel;

  document.body.classList.remove("loading");
  window.scrollTo(0, 0);

  // Call the route change handler if it's set
  if (onRouteChange) onRouteChange(currentPath);
  log("Route change completed");
};

//link management

const fetchAndSaveContent = async link => {
  if (!cache[link.href]) {
    log("Prefetching content for:", link.href);
    cache[link.href] = await fetchContent(link.href);
  }
};

const handleLinkIntersection = (entries, observer) => {
  log("🔍 Intersection Observer triggered for", entries.length, "entries");
  entries.forEach(entry => {
    const link = entry.target;
    log(`🎯 Link ${link.href} intersection:`, {
      isIntersecting: entry.isIntersecting,
      intersectionRatio: entry.intersectionRatio,
      alreadyCached: !!cache[link.href],
    });

    if (entry.isIntersecting) {
      if (!cache[link.href]) {
        fetchAndSaveContent(link);
        log("👁️ Unobserving link after prefetch initiated:", link.href);
        observer.unobserve(link);
      } else {
        log("📦 Content already cached for:", link.href);
      }
    }
  });
};

const handleLinkHover = async event => {
  const link = event.target;
  if (!cache[link.href] && isInternalLink(link.href)) {
    await fetchAndSaveContent(link);
  }
};

const handleLinkClick = e => {
  const link = e.target.closest("A");
  if (!link || !link.href || !isInternalLink(link.href) || link.origin !== location.origin) {
    log("Invalid link click:", link?.href);
    return;
  }
  log("Internal link clicked:", link.href);
  e.preventDefault();
  globalThis.history.pushState(null, null, link.href);
  globalThis.dispatchEvent(new Event("popstate"));
};

const observeLinks = observer => {
  const saveDataOn = navigator.connection && navigator.connection.saveData;
  const links = document.querySelectorAll("a");

  log("🔄 Starting link observation...", {
    totalLinks: links.length,
    saveDataMode: saveDataOn,
  });

  links.forEach(link => {
    const shouldObserve = link.getAttribute("prefetch") !== "onHover" && !saveDataOn && isInternalLink(link.href);

    log("🔗 Link evaluation:", {
      href: link.href,
      prefetchAttr: link.getAttribute("prefetch"),
      isInternal: isInternalLink(link.href),
      willObserve: shouldObserve,
    });

    if (shouldObserve) {
      observer.observe(link);
      log("👀 Now observing link:", link.href);
    }
  });
};

function isInternalLink(href) {
  if (!href || href.startsWith("#") || href.startsWith("javascript:")) return false;
  if (href.startsWith("/")) return true;

  try {
    const url = new URL(href, window.location.origin);
    const currentUrl = new URL(window.location.href);

    const currentHost = currentUrl.hostname.replace(/^www\./, "");
    const targetHost = url.hostname.replace(/^www\./, "");

    // Compare hosts
    if (currentHost !== targetHost) return false;

    // Compare paths (ignoring parameters and fragments)
    const currentPath = currentUrl.pathname;
    const targetPath = url.pathname;

    return currentPath !== targetPath || !url.hash;
  } catch {
    return false;
  }
}

let onRouteChange;

const setRouteChangeHandler = handler => {
  onRouteChange = handler;
};

const fetchContent = async url => {
  const response = await fetchWithFallback(url);
  if (!response.ok) {
    return `Couldn't fetch the route - HTTP error! status: ${response.status}`;
  }
  return await response.text();
};

// Updated fetchWithFallback to check the flag
const fetchWithFallback = async url => {
  if (!manualMode) {
    const res = await fetch(url, { method: "POST", body: "onlyRoute" });
    if (res.ok) return res;
  }
  return await fetch(url);
};

let manualMode = false;
const startRouter = (options = {}) => {
  const { onRouteChange, debug } = options;
  debugMode = debug;
  const pageTitle = document.querySelector("title")?.textContent?.trim() ?? "";
  globalTitle = pageTitle.includes("|") ? pageTitle.split("|").at(-1).trim() : pageTitle || "App";
  log("Router starting...", options);
  if (onRouteChange) setRouteChangeHandler(onRouteChange);
  const style = document.createElement("style");
  style.textContent = `
      .loading {
          animation: pulse 1s infinite alternate;
      }
      @keyframes pulse {
          from { opacity: 0.6; }
          to { opacity: 0.1; }
      }
      route {
        content-visibility: auto;
      }
  `;
  document.head.appendChild(style);

  let router = document.querySelector("router");
  const currentPath = globalThis.location.pathname.replace(/\/$/, "") || "/";

  if (!router) {
    log("Creating new router element");
    router = document.createElement("router");
    const route = document.createElement("route");
    route.setAttribute("path", currentPath);
    route.innerHTML = document.body.innerHTML;
    router.appendChild(route);
    document.body.innerHTML = "";
    document.body.appendChild(router);
    manualMode = true;
  }

  globalThis.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleLinkClick);

  document.body.addEventListener("mouseover", event => {
    if (event.target.tagName === "A" && event.target.getAttribute("prefetch") === "onHover") {
      handleLinkHover(event);
    }
  });

  const observer = new IntersectionObserver(handleLinkIntersection, {
    root: null,
    threshold: 0.5,
  });
  log("🎭 Created Intersection Observer with config:", {
    root: "viewport",
    threshold: 0.5,
  });

  observeLinks(observer);

  // Initialize scroll routes
  const scrollRoutes = router.querySelectorAll("route[scroll]");
  if (scrollRoutes.length) {
    const currentScrollRoute = router.querySelector(`route[path="${currentPath}"][scroll]`);
    if (currentScrollRoute) {
      // Direct URL visit to a scroll route — show all scroll sections and jump instantly
      showScrollRoutes(router);
      currentScrollRoute.scrollIntoView({ behavior: "instant" });
    }

    // Update URL and title as scroll routes enter the viewport
    const scrollObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const path = entry.target.getAttribute("path") || "/";
            globalThis.history.replaceState(null, null, path);
            const label = getTitle(entry.target, path);
            document.title = globalTitle ? `${label} | ${globalTitle}` : label;
            if (onRouteChange) onRouteChange(path);
          }
        });
      },
      { threshold: 0.6 }
    );

    scrollRoutes.forEach(route => scrollObserver.observe(route));
  }
};

export { startRouter };

// TODO: create ultra minified version or deploy
// TODO: write proper automated tests
