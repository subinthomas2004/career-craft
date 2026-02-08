export const getOtpEmailTemplate = (otp) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
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
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your CareerCraft account. Please use the following One Time Password (OTP) to reset your password:</p>
                
                <div class="otp-box">
                    <span class="otp-code">${otp}</span>
                </div>

                <p>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
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
