import fs from 'fs';

export default function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8').trim();
  } catch (e) {
    return null;
  }
}
