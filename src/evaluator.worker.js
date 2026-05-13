import { evaluateAI } from './evaluator.js';

self.onmessage = (e) => {
  const { code, startingPlayer } = e.data;
  
  try {
    const results = evaluateAI(code, startingPlayer);
    self.postMessage({ type: 'results', results, code });
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};
