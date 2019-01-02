# rax-starter-kit

## Getting Started

### `npm run start`

Runs the app in development mode.

Open [http://localhost:9999](http://localhost:9999) to view it in the browser.

The page will reload if you make edits.

### `npm run lint`

You will see the lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.

## Universal "Gotchas"

- DOM & DOM like **`window`** & **`document`** do not exist on the server - so using them, or any library that uses them (jQuery for example) will not work.
- If you need to use them, consider limiting them to wrapping them situationally with the imported *isWeb / isNode / isWeex* features from Universal. `import {isWeb, isWeex, isNode} from 'universal-env'`;
