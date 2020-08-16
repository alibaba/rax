export default function(render) {
  // _forwardRef is also use in rax server renderer
  render._forwardRef = true;
  return render;
}