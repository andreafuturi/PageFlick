let linkData = {};
const handlePopState = async () => {
  const router = document.querySelector("router");
  const currentPath = globalThis.location.pathname;

  let currentRoute = router.querySelector(`route[path="${currentPath}"]`);

  if (!currentRoute) {
    currentRoute = document.createElement("route");
    currentRoute.setAttribute("path", globalThis.location.pathname);
    router.appendChild(currentRoute);
  }

  document.body.classList.add("loading");

  let content = linkData[globalThis.location.href];
  if (!content) {
    content = await fetchContent(globalThis.location.href);
    linkData[globalThis.location.href] = content;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");

  // Update the page title with the new content's title
  const newTitle = doc.querySelector("title");
  if (newTitle) document.title = newTitle.textContent;

  currentRoute.innerHTML = doc.body.innerHTML;

  // Execute scripts from the fetched content
  const scripts = Array.from(currentRoute.querySelectorAll("script"));
  for (const oldScript of scripts) {
    const newScript = document.createElement("script");
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.parentNode.replaceChild(newScript, oldScript);
  }

  router.querySelectorAll("route").forEach(route => (route.style.display = "none"));
  currentRoute.style.display = "contents";

  document.body.classList.remove("loading");
  // Reset scroll position to the top
  window.scrollTo(0, 0);

  // Call the route change handler if it's set
  if (onRouteChange) onRouteChange(currentPath);
};

//link management

const fetchAndSaveContent = async link => {
  if (!linkData[link.href]) {
    linkData[link.href] = await fetchContent(link.href);
  }
};

const handleLinkIntersection = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const link = entry.target;
      if (!linkData[link.href]) {
        fetchAndSaveContent(link);
        observer.unobserve(link);
      }
    }
  });
};

const handleLinkHover = async event => {
  const link = event.target;
  if (!linkData[link.href] && isInternalLink(link.href)) {
    await fetchAndSaveContent(link);
  }
};

const handleLinkClick = e => {
  const link = e.target.closest("A");
  if (!link || !link.href || !isInternalLink(link.href) || link.origin !== location.origin) return;
  else e.preventDefault();
  globalThis.history.pushState(null, null, link.href);
  globalThis.dispatchEvent(new Event("popstate"));
};

const observeLinks = observer => {
  const saveDataOn = navigator.connection && navigator.connection.saveData;
  const links = document.querySelectorAll("a");

  links.forEach(link => {
    if (link.getAttribute("prefetch") !== "onHover" && !saveDataOn && !isInternalLink(link.href)) observer.observe(link);
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
  if (!routerCreatedManually) {
    const res = await fetch(url, { method: "POST", body: "onlyRoute" });
    if (res.ok) return res;
  }
  return await fetch(url);
};

let routerCreatedManually = false;
const startRouter = (options = {}) => {
  const { onRouteChange } = options;
  if (onRouteChange) setRouteChangeHandler(onRouteChange);
  const style = document.createElement("style");
  style.textContent = `
      .loading {
          animation: pulse 1s infinite alternate;
      }
      @keyframes pulse {
          from { opacity: 0.8; }
          to { opacity: 0.3; }
      }
      route {
        content-visibility: auto;
      }
  `;
  document.head.appendChild(style);

  let router = document.querySelector("router");
  const currentPath = globalThis.location.pathname;

  if (!router) {
    router = document.createElement("router");
    const route = document.createElement("route");
    route.setAttribute("path", currentPath);
    route.innerHTML = document.body.innerHTML;
    router.appendChild(route);
    document.body.innerHTML = "";
    document.body.appendChild(router);
    routerCreatedManually = true;
  }

  globalThis.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleLinkClick);

  document.body.addEventListener("mouseover", event => {
    if (event.target.tagName === "A" && event.target.getAttribute("prefetch") === "onHover") {
      handleLinkHover(event);
    }
  });

  const observer = new IntersectionObserver(handleLinkIntersection, { root: null, threshold: 0.5 });
  observeLinks(observer);
};

export { startRouter };
