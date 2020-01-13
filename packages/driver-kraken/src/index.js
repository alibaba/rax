import KrakenDriver from './KrakenDriver';

export { KrakenDriver };

export default function createDriver() {
  return new KrakenDriver();
}

