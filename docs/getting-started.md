# Getting Started

Welcome to Rax! Start your first Rex project, you have to install the dependencies used to build and manage Rax apps: **Node.js**, **Rax CLI** and the **Weex Playground App**. If you already have installed, you can skip ahead to the Tutorial.

## Installing Node.js

If you already have Node.js installed, make sure it is at least version 4.0.

* **Mac**: We recommend installing Node.js using [Homebrew](http://brew.sh/). Run the following commands in a Terminal after installing Homebrew:
```sh
$ brew install node
```
* **Windows**: Get the Windows installer from the [nodejs.org download page](https://nodejs.org/en/download/).
* **Linux**: Go to the [nodejs.org package manager page](https://nodejs.org/en/download/package-manager/) to find specific instructions for your Linux distribution.

## Installing Weex Playground App

Go to the [Weex Playground download page](http://weex-project.io/download.html) to install.

## Installing Rax CLI

Node.js comes with npm, which lets you install the Rax command line interface.

Run the following command in a Terminal:
```sh
$ npm install -g rax-cli
```

> If you get a permission error, try using sudo: sudo npm install -g rax-cli.


## Creating your first project

We can use the Rax command line interface tool to generate a new project called `hello-world`. The tool creates a new folder containing the skeleton for a Rax project and fetches all the necessary external dependencies.

1. Use the React VR CLI tool to create a new application under a `hello-world` folder and install the required dependencies:
```sh
$ rax init hello-world
Creating a new Rax project in /Users/anonymous/hello-world
Install dependencies:
...
To run your app:
   cd hello-world
   npm run start
```
2. Change directory to your new `hello-world` project directory:
```sh
$ cd hello-world
/Users/anonymous/hello-world
|-- README.md
|-- node_modules
|-- package.json
|-- public
|-- src
`-- webpack.config.js
```
After you initially ran the `rax init`, it created a bunch of files in the project directory. What are they all for?
  * `src/index.js` is the entry point for your Rax app. It contains your application code.
  * `public` directory contains `index.html`, which is the web page that launches your application.
  * `package.json` is a configuration file for your project. It tells `npm` how to install your project's external dependencies, such as the `rax` and `rax-components` libraries.
3. Use the start command to initialize your local development server:
```sh
$ npm run start
```
4. Open your browser to `http://0.0.0.0:8080/`. You should see something similar to the following:
<img width=300 src="https://cloud.githubusercontent.com/assets/677114/21576099/2e550f2e-cf5f-11e6-98dc-8782af189b84.png">

5. Scan QRCode in the terminal using weex playground app. You should see something similar to the following:
<img width=300 src="https://cloud.githubusercontent.com/assets/677114/21576152/5091487c-cf60-11e6-9440-19eda52d6255.png">
