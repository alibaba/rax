# rx-starter

## Universal "Gotchas"

- DOM & DOM like **`window`** & **`document`** do not exist on the server - so using them, or any library that uses them (jQuery for example) will not work.
- If you need to use them, consider limiting them to wrapping them situationally with the imported *isWeb / isNode / isWeex* features from Universal. `import {isWeb, isWeex, isNode} from 'universal-env'`;
