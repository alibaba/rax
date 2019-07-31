cd ../rax-plugin-app
tnpm link ../raxappTest/node_modules/rax
tnpm link ../universal-app-shell-loader

cd ../universal-app-runtime
tnpm link ../raxappTest/node_modules/rax

cd ../raxappTest
tnpm link ../rax-scripts
tnpm link ../rax-plugin-app
tnpm link ../universal-app-runtime
