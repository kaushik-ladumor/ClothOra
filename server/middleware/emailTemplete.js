export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your ClothOra Account</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        border: 1px solid #eee;
      }
      .header {
        background-color: #2B2B2B;
        color: #FDD835;
        padding: 20px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 30px;
        color: #333;
        line-height: 1.7;
      }
      .verification-code {
        font-size: 24px;
        background: #fffbe6;
        border: 1px dashed #FDD835;
        color: #2B2B2B;
        padding: 12px;
        text-align: center;
        font-weight: bold;
        margin: 20px auto;
        width: 50%;
        border-radius: 6px;
      }
      .footer {
        background-color: #fafafa;
        text-align: center;
        font-size: 13px;
        color: #888;
        padding: 16px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to ClothOra</div>
      <div class="content">
        <p>Hello,</p>
        <p>We're excited to have you join <strong>ClothOra</strong>! To complete your signup, please verify your email address using the code below:</p>
        <div class="verification-code">{verificationCode}</div>
        <p>If you didn’t create this account, you can safely ignore this email. Feel free to contact us if you have any questions.</p>
      </div>
      <div class="footer">&copy; ${new Date().getFullYear()} ClothOra. All rights reserved.</div>
    </div>
  </body>
  </html>
`;


export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ClothOra</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f5f5f5;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        border: 1px solid #ddd;
      }
      .header {
        background-color: #2B2B2B;
        color: #FDD835;
        padding: 20px;
        text-align: center;
        font-size: 26px;
        font-weight: bold;
      }
      .content {
        padding: 25px;
        line-height: 1.8;
      }
      .button {
        display: inline-block;
        padding: 12px 20px;
        margin: 20px 0;
        background-color: #FDD835;
        color: #2B2B2B;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
        transition: background-color 0.3s;
      }
      .button:hover {
        background-color: #e6c200;
      }
      .footer {
        background-color: #fafafa;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #777;
        border-top: 1px solid #ddd;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Welcome to ClothOra!</div>
      <div class="content">
        <p>Hi {name},</p>
        <p>Thank you for joining <strong>ClothOra</strong> – your one-stop shop for the latest fashion trends and timeless classics. We’re thrilled to have you with us!</p>
        <p>Here’s what you can do next:</p>
        <ul>
          <li>🎯 Browse exclusive collections curated just for you</li>
          <li>🛒 Add your favorites to your cart and checkout securely</li>
          <li>📦 Track your orders in real-time</li>
        </ul>
        <a href="https://clothora.com" class="button">Explore Now</a>
        <p>If you need assistance, our support team is just a click away. Enjoy shopping with us!</p>
      </div>
      <div class="footer">&copy; ${new Date().getFullYear()} ClothOra. All rights reserved.</div>
    </div>
  </body>
  </html>
`;
