export default function invokeFunctionsWithContext(fns, context) {
  for (let i = 0, l = fns && fns.length; i < l; i++) {
    fns[i].call(context);
  }
}
