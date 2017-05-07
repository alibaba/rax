// This is the master class, it does require the start code to be
// included in the string

import Barcode from '../Barcode.js';

class CODE128 extends Barcode {
  constructor(data, options) {
    super(data.substring(1), options);

    // Fill the bytes variable with the ascii codes of string
    this.bytes = [];
    for (var i = 0; i < data.length; ++i) {
      this.bytes.push(data.charCodeAt(i));
    }

    // Data for each character, the last characters will not be encoded but are used for error correction
    // Numbers encode to (n + 1000) -> binary; 740 -> (740 + 1000).toString(2) -> "11011001100"
    this.encodings = [ // + 1000
      740, 644, 638, 176, 164, 100, 224, 220, 124, 608, 604,
      572, 436, 244, 230, 484, 260, 254, 650, 628, 614, 764,
      652, 902, 868, 836, 830, 892, 844, 842, 752, 734, 590,
      304, 112, 94, 416, 128, 122, 672, 576, 570, 464, 422,
      134, 496, 478, 142, 910, 678, 582, 768, 762, 774, 880,
      862, 814, 896, 890, 818, 914, 602, 930, 328, 292, 200,
      158, 68, 62, 424, 412, 232, 218, 76, 74, 554, 616,
      978, 556, 146, 340, 212, 182, 508, 268, 266, 956, 940,
      938, 758, 782, 974, 400, 310, 118, 512, 506, 960, 954,
      502, 518, 886, 966, 668, 680, 692,
      5379
    ];
  }

	// The public encoding function
  encode() {
    var encodingResult;
    var bytes = this.bytes;
    // Remove the startcode from the bytes and set its index
    var startIndex = bytes.shift() - 105;

    // Start encode with the right type
    if (startIndex === 103) {
      encodingResult = this.nextA(bytes, 1);
    } else if (startIndex === 104) {
      encodingResult = this.nextB(bytes, 1);
    } else if (startIndex === 105) {
      encodingResult = this.nextC(bytes, 1);
    } else {
      throw new InvalidStartCharacterException();
    }

    return {
      text: this.text == this.data ? this.text.replace(/[^\x20-\x7E]/g, '') : this.text,
      data:
    	// Add the start bits
    	this.getEncoding(startIndex) +
    	// Add the encoded bits
    	encodingResult.result +
    	// Add the checksum
    	this.getEncoding((encodingResult.checksum + startIndex) % 103) +
    	// Add the end bits
    	this.getEncoding(106)
    };
  }

  getEncoding(n) {
    return this.encodings[n] ? (this.encodings[n] + 1000).toString(2) : '';
  }

	// Use the regexp variable for validation
  valid() {
    // ASCII value ranges 0-127, 200-211
    return this.data.search(/^[\x00-\x7F\xC8-\xD3]+$/) !== -1;
  }

  nextA(bytes, depth) {
    if (bytes.length <= 0) {
      return {'result': '', 'checksum': 0};
    }

    var next, index;

    // Special characters
    if (bytes[0] >= 200) {
      index = bytes[0] - 105;

    	// Remove first element
      bytes.shift();

    	// Swap to CODE128C
      if (index === 99) {
        next = this.nextC(bytes, depth + 1);
      } else if (index === 100) {
        // Swap to CODE128B
        next = this.nextB(bytes, depth + 1);
      } else if (index === 98) {
        // Shift
        // Convert the next character so that is encoded correctly
        bytes[0] = bytes[0] > 95 ? bytes[0] - 96 : bytes[0];
        next = this.nextA(bytes, depth + 1);
      } else {
        // Continue on CODE128A but encode a special character
        next = this.nextA(bytes, depth + 1);
      }
    } else {
      // Continue encoding of CODE128A
      var charCode = bytes[0];
      index = charCode < 32 ? charCode + 64 : charCode - 32;

    	// Remove first element
      bytes.shift();

      next = this.nextA(bytes, depth + 1);
    }

    // Get the correct binary encoding and calculate the weight
    var enc = this.getEncoding(index);
    var weight = index * depth;

    return {
      'result': enc + next.result,
      'checksum': weight + next.checksum
    };
  }

  nextB(bytes, depth) {
    if (bytes.length <= 0) {
      return {'result': '', 'checksum': 0};
    }

    var next, index;

    // Special characters
    if (bytes[0] >= 200) {
      index = bytes[0] - 105;

    	// Remove first element
      bytes.shift();

    	// Swap to CODE128C
      if (index === 99) {
        next = this.nextC(bytes, depth + 1);
      } else if (index === 101) {
        // Swap to CODE128A
        next = this.nextA(bytes, depth + 1);
      } else if (index === 98) {
        // Shift
        // Convert the next character so that is encoded correctly
        bytes[0] = bytes[0] < 32 ? bytes[0] + 96 : bytes[0];
        next = this.nextB(bytes, depth + 1);
      } else {
        // Continue on CODE128B but encode a special character
        next = this.nextB(bytes, depth + 1);
      }
    } else {
      // Continue encoding of CODE128B
      index = bytes[0] - 32;
      bytes.shift();
      next = this.nextB(bytes, depth + 1);
    }

    // Get the correct binary encoding and calculate the weight
    var enc = this.getEncoding(index);
    var weight = index * depth;

    return {'result': enc + next.result, 'checksum': weight + next.checksum};
  }

  nextC(bytes, depth) {
    if (bytes.length <= 0) {
      return {'result': '', 'checksum': 0};
    }

    var next, index;

    // Special characters
    if (bytes[0] >= 200) {
      index = bytes[0] - 105;

    	// Remove first element
      bytes.shift();

    	// Swap to CODE128B
      if (index === 100) {
        next = this.nextB(bytes, depth + 1);
      } else if (index === 101) {
        // Swap to CODE128A
        next = this.nextA(bytes, depth + 1);
      } else {
        // Continue on CODE128C but encode a special character
        next = this.nextC(bytes, depth + 1);
      }
    } else {
      // Continue encoding of CODE128C
      index = (bytes[0] - 48) * 10 + bytes[1] - 48;
      bytes.shift();
      bytes.shift();
      next = this.nextC(bytes, depth + 1);
    }

    // Get the correct binary encoding and calculate the weight
    var enc = this.getEncoding(index);
    var weight = index * depth;

    return {'result': enc + next.result, 'checksum': weight + next.checksum};
  }
}

class InvalidStartCharacterException extends Error {
  constructor() {
    super();
    this.name = 'InvalidStartCharacterException';
    this.message = 'The encoding does not start with a start character.';
  }
}

export default CODE128;
