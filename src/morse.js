const MORSE_MAP = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  Ñ: '--.--', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
  5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.',
  '=': '-...-', '+': '.-.-.', '-': '-....-', _: '..--.-', '"': '.-..-.',
  $: '...-..-', '@': '.--.-.',
};

const TEXT_MAP = Object.fromEntries(
  Object.entries(MORSE_MAP).map(([char, code]) => [code, char])
);

// Quita acentos (á -> a) pero conserva la ñ
const normalize = (text) =>
  text
    .toUpperCase()
    .replace(/Ñ/g, '\u0001')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0001/g, 'Ñ');

export const isValidText = (text) =>
  [...normalize(text)].every((c) => c === ' ' || c === '\n' || c in MORSE_MAP);

export const isValidMorse = (morse) => /^[.\-/\s]+$/.test(morse);

export const textToMorse = (text) =>
  normalize(text)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => [...word].map((c) => MORSE_MAP[c]).join(' '))
    .join(' / ');

export const morseToText = (morse) => {
  const words = morse.trim().split(/\s*\/\s*/);
  let unknown = null;
  const result = words
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((code) => {
          if (!(code in TEXT_MAP)) unknown = unknown || code;
          return TEXT_MAP[code];
        })
        .join('')
    )
    .join(' ');
  return { result, unknown };
};
