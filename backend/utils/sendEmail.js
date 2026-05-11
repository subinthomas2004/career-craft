import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});


const sendEmail = async (options) => {
    try {
        const payload = {
            subject: options.subject,
            to: [{ email: options.email }],
            sender: { 
                name: process.env.FROM_NAME || 'CareerCraft', 
                email: process.env.FROM_EMAIL || 'careercraft@example.com' 
            }
        };

        if (options.isHtml) {
            payload.htmlContent = options.message;
        } else {
            payload.textContent = options.message;
        }

        const data = await brevo.transactionalEmails.sendTransacEmail(payload);
        console.log('Brevo Email API called successfully:', JSON.stringify(data));
    } catch (error) {
        console.error('Brevo API Error:', error);
        throw error;
    }
};

export default sendEmail;
