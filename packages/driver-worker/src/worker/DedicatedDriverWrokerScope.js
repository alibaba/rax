import { createDocument } from './Document';
// Location
// Navigator
//

export function createDedicatedDriverWrokerScope() {
  return {
    document: createDocument(),
    // location: createLocation(),
  };
}
