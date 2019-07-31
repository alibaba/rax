cd ../rax-plugin-app
npm link ../raxappTest/node_modules/rax
npm link ../universal-app-shell-loader

cd ../universal-app-runtime
npm link ../raxappTest/node_modules/rax

cd ../raxappTest
npm link ../rax-scripts
npm link ../rax-plugin-app
npm link ../universal-app-runtime
