import Host from './host';
import BaseComponent from './base';

/**
 * Empty Component
 */
class EmptyComponent extends BaseComponent {
  __createNativeNode() {
    return Host.driver.createEmpty(this);
  }
  __updateComponent() {
    return;
  }
}

export default EmptyComponent;
