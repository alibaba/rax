import { render, createElement, unmountComponentAtNode } from 'rax';

let id = 0;
export function renderSFCModule(Mod) {
  if (Mod && Mod.__esModule === true) {
    // 兼容 commonjs
    Mod = Mod.default;
  }
  const container = document.createElement('div');
  container.setAttribute('id', 'test-container-' + id++);
  document.body.appendChild(container);
  render(createElement(Mod, {}, []), container);
  container.unmount = () => {
    unmountComponentAtNode(container);
  };
  return container;
}
