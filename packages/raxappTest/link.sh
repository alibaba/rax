cd ../rax-plugin-app
cnpm link ../raxappTest/node_modules/rax
cnpm link ../universal-app-shell-loader

cd ../universal-app-runtime
cnpm link ../raxappTest/node_modules/rax

cd ../raxappTest
cnpm link ../rax-scripts
cnpm link ../rax-plugin-app
cnpm link ../universal-app-runtime
