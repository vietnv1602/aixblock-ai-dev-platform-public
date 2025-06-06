module.exports = {
  locales: ['en', 'fr', 'it', 'de', 'nl', 'ja', 'es', 'id', 'vi', 'zh', 'pt', 'hu', 'uk', 'bg'], // Your supported languages
  output: 'packages/frontend/public/locales/$LOCALE/$NAMESPACE.json', // Where to output the JSON files
  input: ['src/**/*.{js,jsx,ts,tsx}', '!src/features/plans/**/*.{js,jsx,ts,tsx}', '!src/app/routes/platform/**/*.{js,jsx,ts,tsx}'], // Where to find your React files 
  defaultNamespace: 'translation', // Default namespace if not specified
  createOldCatalogs: false, // Don’t maintain the existing structure with old keys
  lexers: {
    js: ['JavascriptLexer'],
    jsx: ['JavascriptLexer'],
    ts: ['JavascriptLexer'],
    tsx: ['JavascriptLexer'],
  },
  keepRemoved: false,
  keySeparator: false, // Disable key separator
  nsSeparator: false, // Disable namespace separator
};