# Publishing Your Project

## Building a production release

Once you've built a application, chances are you'll want to share it on the web. Rax ships with a script to package everything up into a few files that you can place on your web server. From the root directory of your project, run the following:
```sh
$ npm run build
```
This creates a new directory in root directory called `build`. Inside are the compiled versions of your application files. These can be placed on a web server and should work without any changes as long as they are placed in the same directory.
```sh
build
|-- index.html
`-- js
  |-- index.bundle.min.js
  `-- index.bundle.min.js.map
```
If you want to host your JavaScript files from a separate location, you can do so by modifying the contents of `index.html`. Make sure the script tag at the top points to the correct location for `index.bundle.min.js`.
