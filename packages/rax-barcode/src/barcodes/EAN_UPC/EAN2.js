// Encoding documentation:
// https://en.wikipedia.org/wiki/EAN_2#Encoding

import EANencoder from './ean_encoder.js';
import Barcode from '../Barcode.js';

class EAN2 extends Barcode {
  constructor(data, options) {
    super(data, options);

    this.structure = ['LL', 'LG', 'GL', 'GG'];
  }

  valid() {
    return this.data.search(/^[0-9]{2}$/) !== -1;
  }

  encode() {
    var encoder = new EANencoder();

		// Choose the structure based on the number mod 4
    var structure = this.structure[parseInt(this.data) % 4];

		// Start bits
    var result = '1011';

		// Encode the two digits with 01 in between
    result += encoder.encode(this.data, structure, '01');

    return {
      data: result,
      text: this.text
    };
  }
}

export default EAN2;
