import * as brevo from '@getbrevo/brevo';

const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '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');

const sendEmail = async (options) => {
    try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = options.subject;
        sendSmtpEmail.to = [{ email: options.email }];
        sendSmtpEmail.sender = { 
            name: process.env.FROM_NAME || 'CareerCraft', 
            email: process.env.FROM_EMAIL || 'careercraft@example.com' 
        };

        if (options.isHtml) {
            sendSmtpEmail.htmlContent = options.message;
        } else {
            sendSmtpEmail.textContent = options.message;
        }

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Brevo Email API called successfully. Message ID: %s', JSON.stringify(data));
    } catch (error) {
        console.error('Brevo API Error:', error);
        throw error;
    }
};

export default sendEmail;
