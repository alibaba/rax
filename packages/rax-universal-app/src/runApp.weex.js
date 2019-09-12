import { render, createElement } from 'rax';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

export default function runApp(config) {
  const { routes } = config;

  let currentHistory = createMemoryHistory();

  let launched = false;

  function renderEntry() {
    if (!launched) {
      launched = true;
      emit('launch');
    }

    let { entry } = useRouter({
      history: currentHistory,
      routes,
    });

    render(
      entry,
      null,
      { driver: UniversalDriver }
    );
  }

  renderEntry();
}
