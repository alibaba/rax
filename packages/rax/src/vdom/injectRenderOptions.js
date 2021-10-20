import Host from './host';
import { throwError, throwMinifiedError } from '../error';

export default function injectRenderOptions({ driver, measurer }) {
  // Inject render driver
  if (!(Host.driver = driver || Host.driver)) {
    if (process.env.NODE_ENV !== 'production') {
      throwError('Rax driver not found.');
    } else {
      throwMinifiedError(5);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Inject performance measurer
    Host.measurer = measurer;
  }
}
