export const getPathname = () => {
  const { pathname } = globalThis.location;
  return pathname.startsWith("/") ? pathname.slice(1) : pathname;
};

export const fetchContent = async (url) => {
  const response = await fetch(url, { method: "POST", body: "onlyRoute" });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let content = "";
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    content += decoder.decode(value);
  }
  return content;
};
