# jsx2mp

A cli tool to transform Rax JSX based project to MiniApp.

## Usage as cli tool.

1. Create a miniapp based project using rax-cli.
	```bash
	rax init myApp --type=miniapp
	```
	
2. Install jsx2mp
	```bash
	npm install jsx2mp -g
	```
	
3. Transform your project.
	```bash
	cd myApp
	jsx2mp
	```
	The tool will keep watching your source files before being interpreted by `Ctrl + C`.
	
4. Use `小程序开发工具` to open `dist` directory under your project path.
  
