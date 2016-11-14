import {createElement, render} from 'universal-rx';
import ExampleList from './common/List';

const EXAMPLES = [
  // common
  {name: '/syntax/hello-world', title: 'Hello World'},
  {name: '/style/index', title: 'Common Style'},
  // component
  {name: '/components/text', title: 'Text'},
  {name: '/components/image', title: 'Image'},
  {name: '/components/input', title: 'Input'},
  {name: '/components/scroller', title: 'Scroller'},
  {name: '/components/list', title: 'List'},
  {name: '/components/slider', title: 'Slider'},
  {name: '/components/a', title: 'A'},
  {name: '/components/video', title: 'Video'},
  {name: '/components/countdown', title: 'Countdown'},
  {name: '/components/marquee', title: 'Marquee'},
  {name: '/components/web', title: 'Web'},
  {name: '/components/navigator', title: 'Navigator'},
  {name: '/components/tabbar', title: 'Tabbar'},
  // module
  {name: '/modules/modal', title: 'Modal'},
  {name: '/modules/stream', title: 'Stream'},
  {name: '/modules/storage', title: 'Storage'},
  {name: '/modules/animation', title: 'Animation'},
  // {name: 'module/clipboard', title: 'Clipboard'}, // 0.8 , developing
];

render(<ExampleList examples={EXAMPLES} />);
