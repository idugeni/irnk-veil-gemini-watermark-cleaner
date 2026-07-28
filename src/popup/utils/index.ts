export const getLogoUrl = () => {
  try {
    return chrome.runtime.getURL("icon/48.png");
  } catch {
    return "./logo.png";
  }
};

export const creatorInfo = {
  name: "Eliyanto Sarage",
  link: "https://www.instagram.com/eliyantosarage_/",
};
