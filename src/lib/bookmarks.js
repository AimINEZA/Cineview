const STORAGE_KEY = 'cineview:news:bookmarks';

function read() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(items) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function getBookmarks() {
  return read();
}

export function saveBookmark(article) {
  if (!article || !article.url) return;
  const items = read();
  if (items.find(x => x.url === article.url)) return;
  items.unshift(article);
  write(items);
}

export function removeBookmark(url) {
  if (!url) return;
  const items = read().filter(x => x.url !== url);
  write(items);
}

export function isBookmarked(url) {
  if (!url) return false;
  return read().some(x => x.url === url);
}

export default { getBookmarks, saveBookmark, removeBookmark, isBookmarked };