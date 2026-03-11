import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pdf;
try {
    console.log("Requiring pdf-parse...");
    pdf = require('pdf-parse');
    console.log("pdf-parse required successfully. Type:", typeof pdf);
} catch (e) {
    console.warn('Could not load pdf-parse:', e.message);
    pdf = null;
}
