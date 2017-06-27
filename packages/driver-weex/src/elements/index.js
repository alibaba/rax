import img from './img';
import video from './video';
import textarea from './textarea';
import span from './span';
import p from './p';
import button from './button';
import heading from './heading';
import block from './block';

export default {
  span,
  p,
  img,
  button,
  video,
  textarea,
  h1: heading,
  h2: heading,
  h3: heading,
  h4: heading,
  h5: heading,
  h6: heading,
  nav: block,
  article: block,
  section: block,
  // Conflict with weex header tag
  // header: block,
  footer: block,
  aside: block,
  main: block
};
