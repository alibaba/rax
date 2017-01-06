# Key Concepts

Working with Rax requires knowledge of some terminology and key concepts. Here is a quick summary of the most important concepts and how they interact:

* **Components** - Components are reusable UI elements that can be used in tags, such as **`<Greeting/>`**. Rax provides built-in cross container components such as **`Text`** and **`Image`**. Additional components are declared by deriving a class from **`Component`**. Each user component has an implementation that includes a **`render()`** function which returns a set of child sub-components that fully describe its contents.

* **Props** - Components can take arguments such as a **`name`** in **`<Greeting name='Rexxar'/>`**. Such arguments are known as properties or _props_ and are accessed through the **`this.props`** variable. **`name`**, from the above example, is accessible as **`{this.props.name}`**. You can read more about this interaction under [Components, Props and State](docs/components-props-and-state.html).

* **State** - Components can maintain an internal state that affects component display. When state data changes, the component re-renders itself. By convention, all modifiable state is organized inside of a **`this.state`** object within the component and can only be modified through a dedicated **`setState`** function, for example:
```js
this.setState({myStateVariableCounter : 10})
```

* **Events** - Components can generate events that are raised when certain UI action occur. For example, the **`TextInput`** component accepts **`onInput`** and **`onChange`** events when the user enter text in the input:
```html
<TextInput onInput={(e) => this.setState({text: e.value})} />
```

* **Layout** - Rax uses the `flexbox` layout rules to automatically position components. This layout considers component dimensions, which are either computed or specified through width and height, as well as control style attributes such as **`alignItems`**.

* **Style** - Style objects control the look and layout of the component. They are generally specified through a style object. For example:
```html
 <View style={{width: 100, height: 100, backgroundColor: 'skyblue'}}/>
```
Instead of specifying all component attributes inline, style objects can be pulled out and declared externally with the help of `stylesheet-loader`.
