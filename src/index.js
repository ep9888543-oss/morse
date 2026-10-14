import './styles.css';
import { textToMorse, morseToText, isValidText, isValidMorse } from './morse';

const $ = (id) => document.getElementById(id);
const input = $('input');
const output = $('output');
const errorBox = $('error');
let mode = 'text'; // 'text' | 'morse'

const showError = (msg) => {
  errorBox.textContent = msg;
  errorBox.hidden = !msg;
};

const setMode = (newMode) => {
  mode = newMode;
  $('btn-t2m').classList.toggle('active', mode === 'text');
  $('btn-m2t').classList.toggle('active', mode === 'morse');
  $('label-in').textContent = mode === 'text' ? 'Texto' : 'Código morse';
  $('label-out').textContent = mode === 'text' ? 'Resultado (Morse)' : 'Resultado (Texto)';
  input.placeholder = mode === 'text' ? 'Escribe aquí...' : '.... --- .-.. .- / -- ..- -. -.. ---';
  input.value = '';
  output.value = '';
  showError('');
};

const convert = () => {
  const value = input.value.trim();
  showError('');
  output.value = '';

  if (!value) return showError('Escribe algo para convertir.');

  if (mode === 'text') {
    if (!isValidText(value)) {
      return showError('El texto contiene caracteres que no existen en código morse.');
    }
    output.value = textToMorse(value);
  } else {
    if (!isValidMorse(value)) {
      return showError('Solo se permiten puntos (.), guiones (-), espacios y «/».');
    }
    const { result, unknown } = morseToText(value);
    if (unknown) return showError(`Secuencia morse no reconocida: ${unknown}`);
    output.value = result;
  }
};

$('btn-t2m').addEventListener('click', () => setMode('text'));
$('btn-m2t').addEventListener('click', () => setMode('morse'));
$('btn-convert').addEventListener('click', convert);
$('btn-clear').addEventListener('click', () => {
  input.value = '';
  output.value = '';
  showError('');
});
$('btn-swap').addEventListener('click', () => {
  const previous = output.value;
  setMode(mode === 'text' ? 'morse' : 'text');
  input.value = previous;
  if (previous) convert();
});
$('btn-copy').addEventListener('click', async () => {
  if (!output.value) return showError('No hay resultado para copiar.');
  try {
    await navigator.clipboard.writeText(output.value);
    $('btn-copy').textContent = '¡Copiado!';
    setTimeout(() => ($('btn-copy').textContent = 'Copiar resultado'), 1500);
  } catch {
    showError('No se pudo copiar.');
  }
});
