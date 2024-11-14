import { initializeRouter, setRouteChangeHandler } from './router';

export const startRouter = (options = {}) => {
  const { onRouteChange } = options;
  if (onRouteChange) setRouteChangeHandler(onRouteChange);
  initializeRouter();
};
