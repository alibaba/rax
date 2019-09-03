module.exports = `/**
*
* Please register this file in your app, and it's same origin
* required with your website.
*
* This file is auto generated, Please do not edit it directly,
* make changes to your rax-plugin-pwa config and rebuild your
* project.
*
*/

// precache list, specific URL required
let preCacheUrlList = <%= JSON.stringify(preCacheUrlList) %>;

// ignore following assets, match thougth regExp
let ignorePatternList = <%= JSON.stringify(ignorePatternList) %>;

// chche following assets, match thougth regExp
let savedCachePatternList = <%= JSON.stringify(savedCachePatternList) %>;
const CACHE_ID = 'RAX_PWA_SW_CACHE_<%= cacheId %>';

// precache the target assets.
const precache = (target) => {
  return caches.open(CACHE_ID).then((cache) => {
    return cache.addAll(target);
  });
};

const stringToReg = (str) => {
  if (!str) return;
  const match = str.match(/^\\/(.*)\\/(\\w*)/);;
  if (!match) return;
  const [, pattern, flags] = match;
  return new RegExp(pattern, flags);
}

const isMatch = (patternStr, testStr) => {
  const reg = stringToReg(patternStr);

  if (!reg||!testStr) return false;

  return !!testStr.match(reg);
}

// save cache
const saveCache = (req, res) => {
  return caches.open(CACHE_ID).then(cache => {
    if (res.ok) cache.put(req, res);
  });
};
<% if (skipWaiting) { %>
// skip service worker waiting become the active worker
const skipWaiting = () => {
  addEventListener('install', () => self.skipWaiting());
};
skipWaiting();
<% } %>
<% if (clientsClaim) { %>
// When a service worker is initially registered, pages won't
// use it until they next load. The clientsClaim() function causes
// those pages to be controlled immediately.
const clientsClaim = () => {
  addEventListener('activate', () => self.clients.claim());
};
clientsClaim();
<% } %>
self.addEventListener('install', (e) => {
  e.waitUntil(precache(preCacheUrlList));
});

self.addEventListener('fetch', e => {
  let url = new URL(e.request.url);

  if (
    e.request.method != 'GET' ||
    !savedCachePatternList.some(pat => isMatch(pat, url.href)) ||
    // ignore ignorePatternList
    ignorePatternList.some(pat => isMatch(pat, url.href))
  ) {
    return;
  }

  // is same-origin
  let isSameOrigin = url.host === self.location.host;
  let isNavigate = e.request.mode == 'navigate' || e.request.destination == 'document';
  let cached = caches.match(e.request);
  // clone request info for retry request
  let clonedFetch = fetch(
    e.request.clone(),
    isSameOrigin ? {} : {
      mode: 'cors',
      credentials: 'omit'
    }
  );

  let useCached = new Promise((resolve, reject) => {
    if (isNavigate) {
      setTimeout(() => {
        reject();
      }, 20000);
    } else {
      resolve(cached);
    }
  });

  // stale-while-revalidating
  // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate

  // return cache
  e.respondWith(
    Promise.race([clonedFetch.catch(_ => cached), useCached])
      .then(res => {
        return res || clonedFetch;
      })
      .catch(_ => {
        if (isNavigate) return caches.match('/offline/');
      })
  );

  // update cache through last-modified
  let fetchedCopy = clonedFetch.then(_res => _res.clone());
  e.waitUntil(
    Promise.all([fetchedCopy, caches.match(e.request)])
      .then(([resp, cresp]) => {
        let fModified = resp.headers.get('last-modified');
        let cModified = cresp && cresp.headers.get('last-modified');
        if (isNavigate || !fModified || fModified != cModified) {
          return saveCache(e.request, resp);
        }
      })
      .catch(_ => { })
  );
});
`;
