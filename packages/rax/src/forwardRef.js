export default function(render) {
  render.__forwardRef = true;
  return render;
}