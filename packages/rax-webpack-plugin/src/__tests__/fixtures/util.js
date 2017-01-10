import fs from 'fs';

export function readFileOrEmpty(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    return '';
  }
}
