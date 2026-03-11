import { BrevoClient } from '@getbrevo/brevo';

try {
    const brevo = new BrevoClient({
        apiKey: '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'
    });
    console.log("Success! BrevoClient initialized:", Object.keys(brevo));
} catch (e) {
    console.error("Failed:", e.message);
}
