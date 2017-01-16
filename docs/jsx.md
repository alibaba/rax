## JSX

One feature that makes React appealing is that it combines declarative UI elements with code that manipulates them in an elegant way. UI elements are described by component tags that look similar to HTML. For example, the tag **`<Greeting name='Joe'/>`** may describe a greeting UI component that also takes a name as a parameter. These tags are inserted directly into JavaScript with the help of JSX.

[JSX](https://facebook.github.io/react/docs/introducing-jsx.html) is a syntax extension to JavaScript; it is pre-processed in the build process to become JavaScript. JSX allows describing UI more elegantly then would be possible with direct code.

```html
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```
compiles into:
```js
createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```
While using JSX is not mandatory, it is recommended for readability. The React website contains [further details on JSX](https://facebook.github.io/react/docs/jsx-in-depth.html).
