import { createDocument } from './Document';

export default function createWorkerGlobalScope() {
  return {
    document: createDocument()
  };
}
