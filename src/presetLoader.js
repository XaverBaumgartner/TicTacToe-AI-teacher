// imports all .js files from src/presets/
const presetModules = import.meta.glob('./presets/*.js', { query: '?raw', import: 'default', eager: true });

export const presets = Object.fromEntries(
  Object.entries(presetModules)
    .map(([path, code]) => {
      const filename = path.split('/').pop();
      return [filename, code];
    })
    .sort(([a], [b]) => a.localeCompare(b))
);
