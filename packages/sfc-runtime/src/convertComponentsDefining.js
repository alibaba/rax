import { kebabCase } from './utils';

/**
 * When defining a component with PascalCase like MyComponentName,
 * you can use either case when referencing its custom element.
 * That means both <my-component-name> and <MyComponentName> are acceptable.
 */
export default function convertComponentsDefining(definedComponents) {
  const names = Object.keys(definedComponents);
  for (let i = 0, l = names.length; i < l; i++) {
    if (/[A-Z]/.test(names[i][0])) {
      const camelCase = names[i][0].toLowerCase() + names[i].slice(1);
      definedComponents[camelCase] = definedComponents[names[i]];
    }
    const kebabName = kebabCase(names[i]);
    definedComponents[kebabName] = definedComponents[names[i]];
  }
}
