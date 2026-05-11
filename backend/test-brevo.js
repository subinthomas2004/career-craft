import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

try {
    const brevo = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY
    });

    const payload = {
        subject: "Test Email from CareerCraft",
        to: [{ email: "subinthomas965@gmail.com" }],
        sender: { 
            name: "CareerCraft Test", 
            email: "subinthomas965@gmail.com" 
        },
        textContent: "If you are receiving this, the Brevo API is working correctly."
    };

    const data = await brevo.transactionalEmails.sendTransacEmail(payload);
    console.log("Success! Email sent:", JSON.stringify(data));
} catch (e) {
    console.error("Failed:", e.response?.body || e.message);
}

