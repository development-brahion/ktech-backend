export const otpVerificationProcess = (data) => {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Your Verification Code</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style type="text/css">
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background-color: #f0f4f8;
      margin: 0;
      padding: 20px;
      color: #333333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 30px;
      border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      text-align: center;
    }
    .logo {
      margin-bottom: 20px;
    }
    .logo img {
      max-height: 60px;
    }
    h2 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #1a202c;
    }
    p {
      font-size: 16px;
      color: #4a5568;
      margin: 10px 0;
    }
    .otp-container {
      margin: 30px 0;
    }
    .otp-code {
      font-size: 38px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #2b6cb0;
      padding: 18px 28px;
      background: linear-gradient(135deg, #ebf8ff, #dbeafe);
      border: 2px solid #90cdf4;
      border-radius: 10px;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(43,108,176,0.15);
    }
    .note {
      font-size: 14px;
      color: #718096;
      margin-top: 25px;
      line-height: 1.5;
    }
    .footer {
      font-size: 13px;
      color: #a0aec0;
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Always show logo -->
    <div class="logo">
      <img src="${data.company_logo_url}" alt="${data.company_name} Logo">
    </div>

    <h2>🔐 ${data.company_name} ${data.otpType} Verification Code</h2>
    <p>Hello <strong>${data.username || 'User'}</strong>,</p>
    <p>Please use the following One-Time Password (OTP) to continue:</p>
    
    <div class="otp-container">
      <div class="otp-code">${data.otp}</div>
    </div>
    
    <p class="note">
      This code will expire in <strong>${data.expiry_minutes} minutes</strong>.<br>
      For your security, do not share it with anyone.
    </p>
    
    <div class="footer">
      © ${new Date().getFullYear()} ${data.company_name}. All rights reserved.
    </div>
  </div>
</body>
</html>

`;
};
