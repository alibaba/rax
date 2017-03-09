# Networking
Rax uses the Fetch API for fetching resources across a network. If you have used **`XMLHttpRequest`** or other networking APIs before, Fetch will seem familiar.

For general information about Fetch, see [the Fetch API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Making requests

In order to fetch content from an arbitrary URL, just pass the URL to fetch:
```js
fetch('https://mywebsite.com/mydata.json')
```
Fetch also takes an optional second argument that allows you to customize the HTTP request. You may want to specify additional headers, or make a POST request:
```js
fetch('https://mywebsite.com/endpoint/', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'yourValue',
    secondParam: 'yourOtherValue',
  })
})
```

For the full list of Fetch properties, see [the Fetch Request documentation](https://developer.mozilla.org/en-US/docs/Web/API/Request).

## Handling the response
The above examples show how you can make a request. In many cases, you will want to do something with the response.

Networking is an inherently asynchronous operation. Fetch methods will return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that makes it straightforward to write code that works in an asynchronous manner:
```
function getMoviesFromApiAsync() {
  return fetch('https://facebook.github.io/react-native/movies.json')
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
}
```
Don't forget to catch any errors that may be thrown by fetch, otherwise they will be dropped silently.
> By default, iOS will block any request that's not encrypted using SSL. If you need to fetch from a cleartext URL (one that begins with `http`) you will first need to add an App Transport Security exception. If you know ahead of time what domains you will need access to, it is more secure to add exceptions just for those domains; if the domains are not known until runtime you can [disable ATS completely](/react-native/docs/integration-with-existing-apps.html#app-transport-security). Note however that from January 2017, [Apple's App Store review will require reasonable justification for disabling ATS](https://forums.developer.apple.com/thread/48979). See [Apple's documentation](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW33) for more information.
