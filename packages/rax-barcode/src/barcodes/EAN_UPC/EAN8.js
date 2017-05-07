// Encoding documentation:
// http://www.barcodeisland.com/ean8.phtml

import EANencoder from './ean_encoder.js';
import Barcode from '../Barcode.js';

class EAN8 extends Barcode {
  constructor(data, options) {
		// Add checksum if it does not exist
    if (data.search(/^[0-9]{7}$/) !== -1) {
      data += checksum(data);
    }

    super(data, options);
  }

  valid() {
    return this.data.search(/^[0-9]{8}$/) !== -1 &&
			this.data[7] == checksum(this.data);
  }

  encode() {
    var encoder = new EANencoder();

		// Create the return variable
    var result = '';

		// Get the number to be encoded on the left side of the EAN code
    var leftSide = this.data.substr(0, 4);

		// Get the number to be encoded on the right side of the EAN code
    var rightSide = this.data.substr(4, 4);

		// Add the start bits
    result += encoder.startBin;

		// Add the left side
    result += encoder.encode(leftSide, 'LLLL');

		// Add the middle bits
    result += encoder.middleBin;

		// Add the right side
    result += encoder.encode(rightSide, 'RRRR');

		// Add the end bits
    result += encoder.endBin;

    return {
      data: result,
      text: this.text
    };
  }
}

// Calulate the checksum digit
function checksum(number) {
  var result = 0;

  var i;
  for (i = 0; i < 7; i += 2) {
    result += parseInt(number[i]) * 3;
  }

  for (i = 1; i < 7; i += 2) {
    result += parseInt(number[i]);
  }

  return (10 - result % 10) % 10;
}

export default EAN8;
