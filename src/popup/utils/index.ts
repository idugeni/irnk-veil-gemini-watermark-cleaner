export const getLogoUrl = () => {
  try {
    return chrome.runtime.getURL("icon/48.png");
  } catch {
    return "./logo.png";
  }
};

const creatorData = {
  name: "RWxpeWFudG8gU2FyYWdl",
  link: "aHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9lbGl5YW50b3NhcmFnZV8v"
};

export const decodeBase64 = (s: string) => atob(s);

export const creatorInfo = {
  n: creatorData.name,
  l: creatorData.link
};

// Re-export for backward compatibility
export const _d = decodeBase64;
