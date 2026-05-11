export const getOtpEmailTemplate = (otp, type = 'reset') => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${type === 'verification' ? 'Email Verification OTP' : 'Password Reset OTP'}</title>
    <style>
        body {
            font-family: 'Segoe UI', user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0;
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #f4f4f7;
            color: #51545E;
        }
        .email-wrapper {
            width: 100%;
            background-color: #f4f4f7;
            padding: 20px;
        }
        .email-content {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .email-header {
            background-color: #7c3aed; /* Violet-600 to match CareerCraft theme */
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 40px 30px;
            text-align: center;
        }
        .otp-box {
            background-color: #f3f0ff;
            border: 1px dashed #7c3aed;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            display: inline-block;
        }
        .otp-code {
            font-family: 'Courier New', monospace;
            font-size: 36px;
            font-weight: 700;
            color: #7c3aed;
            letter-spacing: 5px;
        }
        .email-footer {
            background-color: #f4f4f7;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="email-header">
                <h1>CareerCraft</h1>
            </div>
            <div class="email-body">
                <h2>${type === 'verification' ? 'Email Verification' : 'Password Reset Request'}</h2>
                <p>Hello,</p>
                <p>${type === 'verification' 
                    ? 'Welcome to CareerCraft! Please use the following One Time Password (OTP) to verify your email address and complete your registration:'
                    : 'We received a request to reset the password for your CareerCraft account. Please use the following One Time Password (OTP) to reset your password:'
                }</p>
                
                <div class="otp-box">
                    <span class="otp-code">${otp}</span>
                </div>

                <p>This OTP is valid for 10 minutes. ${type === 'verification' ? 'If you did not sign up for a CareerCraft account, please ignore this email.' : 'If you did not request a password reset, please ignore this email or contact support if you have concerns.'}</p>
                <p>Best regards,<br>The CareerCraft Team</p>
            </div>
            <div class="email-footer">
                <p>&copy; ${new Date().getFullYear()} CareerCraft. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getWelcomeEmailTemplate = (name) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CareerCraft</title>
    <style>
        body { font-family: 'Segoe UI', user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0; width: 100%; margin: 0; padding: 0; background-color: #f4f4f7; color: #51545E; }
        .email-wrapper { width: 100%; background-color: #f4f4f7; padding: 20px; }
        .email-content { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; }
        .email-header { background-color: #7c3aed; padding: 30px; text-align: center; color: #ffffff; }
        .email-header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .email-body { padding: 40px 30px; text-align: left; line-height: 1.6; }
        .email-footer { background-color: #f4f4f7; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        .feature-list { padding-left: 20px; }
        .feature-list li { margin-bottom: 10px; }
        .btn-primary { display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="email-header">
                <h1>CareerCraft</h1>
            </div>
            <div class="email-body">
                <h2>Welcome aboard, ${name}! 🚀</h2>
                <p>Congratulations and welcome to CareerCraft! We are thrilled to have you join our community of ambitious professionals.</p>
                <p>CareerCraft is your ultimate AI-powered placement preparation companion. We understand that landing your dream job requires more than just submitting a resume—it demands sharp technical skills, excellent communication, and strategic preparation.</p>
                <p>Here is what you can do right now to get started:</p>
                <ul class="feature-list">
                    <li><strong>AI Mock Interviews:</strong> Practice your responses with our advanced AI interviewer tailored to your target role.</li>
                    <li><strong>Resume Analysis:</strong> Get instant, actionable feedback to optimize your ATS score.</li>
                    <li><strong>Skill Assessments:</strong> Take quizzes and coding challenges to identify and bridge your knowledge gaps.</li>
                    <li><strong>Community Forum:</strong> Connect with peers, discuss interview experiences, and share valuable insights.</li>
                </ul>
                <p>Your journey toward career excellence begins today. Dive into the dashboard and start crafting your success story!</p>
                <center>
                    <a href="https://careercraft.com/dashboard" class="btn-primary">Go to Dashboard</a>
                </center>
                <br />
                <p>Best regards,<br>The CareerCraft Team</p>
            </div>
            <div class="email-footer">
                <p>&copy; ${new Date().getFullYear()} CareerCraft. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

export const getBroadcastEmailTemplate = (title, body, link = "") => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; width: 100%; margin: 0; padding: 0; background-color: #f4f4f7; color: #1f2937; }
        .email-wrapper { width: 100%; background-color: #f4f4f7; padding: 20px; }
        .email-content { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e5e7eb; }
        .email-header { background-color: #7c3aed; padding: 32px; text-align: center; color: #ffffff; }
        .email-header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .email-body { padding: 32px; text-align: left; line-height: 1.7; }
        .email-footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; }
        .btn-action { display: inline-block; padding: 12px 32px; background-color: #7c3aed; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; font-size: 15px; }
        .content-body { white-space: pre-wrap; font-size: 16px; color: #4b5563; }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="email-content">
            <div class="email-header">
                <h1>CareerCraft Updates</h1>
            </div>
            <div class="email-body">
                <h2 style="color: #111827; margin-top: 0;">${title}</h2>
                <div class="content-body">${body}</div>
                ${link ? `
                <div style="text-align: center;">
                    <a href="${link.startsWith('http') ? link : 'https://careercraft.com' + link}" class="btn-action">View Update Details</a>
                </div>` : ''}
                <br />
                <p style="margin-bottom: 0;">Best regards,<br><strong>The CareerCraft Admin Team</strong></p>
            </div>
            <div class="email-footer">
                <p>You are receiving this email because you registered on CareerCraft platform.</p>
                <p>&copy; ${new Date().getFullYear()} CareerCraft. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
