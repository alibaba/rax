import { render, createElement } from 'rax';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

function Entry(props) {
  const { component } = useRouter(() => props);
  if (!component || Array.isArray(component) && component.length === 0) {
    // Return null directly if not matched.
    return null;
  } else {
    return createElement(component, { ...props });
  }
}

export default function runApp(config) {
  const { routes } = config;

  let launched = false;

  function renderEntry() {
    if (!launched) {
      launched = true;
      emit('launch');
    }

    const entry = createElement(Entry, { history: createMemoryHistory(), routes });

    render(
      entry,
      null,
      { driver: UniversalDriver }
    );
  }

  renderEntry();
}
