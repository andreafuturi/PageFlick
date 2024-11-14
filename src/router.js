import { fetchContent } from './utils';

let linkData = new Proxy({}, {
  set: (target, property, value) => {
    target[property] = value;
    const router = document.querySelector("router");
    const currentRoute = router?.querySelector(`route[path="${globalThis.location.pathname}"]`) ||
                         router?.querySelector(`route[path="/default"]`);

    if (currentRoute && !currentRoute.innerHTML && property === globalThis.location.href) {
      currentRoute.innerHTML = value;
      if (typeof onRouteChange === 'function') onRouteChange(currentRoute);
    }
    return true;
  },
});

let onRouteChange;

export const setRouteChangeHandler = (handler) => {
  onRouteChange = handler;
};

const fetchAndSaveContent = async (link) => {
  linkData[link.href] = "";
  linkData[link.href] = await fetchContent(link.href);
};

const handleLinkHover = async (event) => {
  const link = event.target;
  if (!linkData[link.href]) await fetchAndSaveContent(link);
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

const handlePopState = async () => {
  const router = document.querySelector("router");
  if (!router) return;
  
  const currentRoute = router.querySelector(`route[path="${globalThis.location.pathname}"]`) ||
                       router.querySelector(`route[path="/default"]`);

  router.querySelectorAll("route").forEach(route => (route.style.display = "none"));
  currentRoute.style.display = "contents";
  
  if (!currentRoute.innerHTML) {
    currentRoute.innerHTML = await linkData[globalThis.location.href];
    if (typeof onRouteChange === 'function') onRouteChange(currentRoute);
  }
};

const handleLinkClick = (e) => {
  if (e.target.tagName === "A" && e.target.href) {
    const href = new URL(e.target.href).pathname;
    if (href.startsWith("/")) {
      e.preventDefault();
      globalThis.history.pushState(null, null, e.target.href);
      globalThis.dispatchEvent(new Event("popstate"));
    }
  }
};

export const observeLinks = (observer) => {
  const saveDataOn = navigator.connection && navigator.connection.saveData;
  const links = document.querySelectorAll("a");
  
  links.forEach(link => {
    if (link.getAttribute("prefetch") !== "onHover" && !saveDataOn) observer.observe(link);
  });
};

export const initializeRouter = () => {
  if (typeof document === "undefined") return;

  globalThis.addEventListener("popstate", handlePopState);
  document.addEventListener("click", handleLinkClick);
  
  document.body.addEventListener("mouseover", (event) => {
    if (event.target.tagName === "A" && event.target.getAttribute("prefetch") === "onHover") {
      handleLinkHover(event);
    }
  });

  const observer = new IntersectionObserver(handleLinkIntersection, { root: null, threshold: 0.5 });
  observeLinks(observer);
};
