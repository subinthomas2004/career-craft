import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
    const lib = require('pdf-parse');
    console.log('--- DEBUG START ---');
    console.log('Type of lib:', typeof lib);
    console.log('Is Array?', Array.isArray(lib));
    console.log('Keys:', Object.keys(lib));
    if (lib.default) {
        console.log('Has default export');
        console.log('Type of default:', typeof lib.default);
    }
    console.log('Lib Value:', lib);
    console.log('--- DEBUG END ---');
} catch (e) {
    console.error('Require failed:', e);
}
