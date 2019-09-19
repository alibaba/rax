# jsx2mp-cli

A cli tool to transform Rax JSX based project to MiniApp.

## Usage as cli tool.

1. Create a miniapp based project using rax-cli.
	```bash
	rax init myApp
	```

2. Install jsx2mp-cli
	```bash
	npm install jsx2mp-cli -g
	```

3. Transform your project.
	```bash
	cd myApp
	jsx2mp start
	```
	The tool will keep watching your source files before being interpreted by `Ctrl + C`.

4. Use `小程序开发工具` to open `dist` directory under your project path.

> You can also use rax-scripts to build miniapp, which intergrate the jsx2mp-cli.

## Integration Testing

As project-based integration testing, the test includes the following cases:

1. import static assets
