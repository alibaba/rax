cd ../universal-app-shell-loader
tnpm i rax
cd ../rax-plugin-app
tnpm i rax

cd ../rax-plugin-app
tnpm link ../universal-app-shell-loader

cd ../raxappTest
tnpm link ../rax-scripts
tnpm link ../rax-plugin-app
tnpm link ../universal-app-runtime
