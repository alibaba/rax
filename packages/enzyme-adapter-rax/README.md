# enzyme-adapter-rax

This is an adapter to support using the [Enzyme](https://airbnb.io/enzyme/) UI
component testing library with [Rax](https://rax.js.org).

## Supported Rax version

The adapter supports Rax 1.x.

## Usage

Add the library to your development dependencies:

```sh
# If using npm
npm install --save-dev enzyme-adapter-rax

# If using yarn
yarn add --dev enzyme-adapter-rax
```

Then in the setup code for your tests, configure Enzyme to use the adapter
provided by this package:

```js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-rax';

configure({ adapter: new Adapter });
```

Once the adapter is configured, you can write Enzyme tests for your Rax
UI components following the [Enzyme docs](https://airbnb.io/enzyme/).
The full DOM rendering, shallow rendering and string rendering modes are
supported.

## Example projects

For runnable example projects, see the [examples/](examples/) directory. To run the
examples locally, clone this repository, then run:

```sh
cd examples/<project name>
npm install
npm test
```

## Differences compared to Enzyme + React

The general intent is that tests written using Enzyme + React can be easily made
to work with Enzyme + Rax. However there are some differences
in behavior between this adapter and Enzyme's React adapters to be aware of:

### Shallow rendering

Rax doesn't support shallow rendering.

### Simulating events

The [simulate](https://airbnb.io/enzyme/docs/api/ReactWrapper/simulate.html)
API does not dispatch actual DOM events in the React adapters, it just calls
the corresponding handler. The Rax adapter does dispatch an actual event
using `element.dispatchEvent(...)`.

**Example:**

```js
const wrapper = mount(<ParentComponent/>);

// Trigger a state update outsize of Enzyme.
wrapper.find(ChildComponent).props().onClick();

// Update the Enzyme wrapper's snapshot.
wrapper.update();

// Test that parent component updated as expected.
```

### Re-render
When target tested component is triggered rerender, you need use `jest.runAllTimers()` to resolve the async render.

**Example:**

```js
const wrapper = mount(<Counter initialCount={5} />);
wrapper.find('button').simulate('click');
jest.runAllTimers();
expect(wrapper.text()).toEqual('Current value: 6');
```
