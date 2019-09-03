module.exports = `/**
*
* Service worker bootstrap.
*
* Service worker lets your app load faster and work offline.
* More information read https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
*
*/
;(function() {
  if ('serviceWorker' in navigator) {<% if (unregister) { %>
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });<% } else { %>
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      console.log('Registration successful, scope is:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed, error:', error);
    });<% } %>
  }
})();
`;
