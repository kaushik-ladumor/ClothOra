export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your ClothOra Account</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 100%);
        margin: 0;
        padding: 20px;
        line-height: 1.6;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(43, 43, 43, 0.1);
        overflow: hidden;
        border: 1px solid #D4D4D4;
      }
      
      .header {
        background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%);
        color: #FFFFFF;
        padding: 40px 30px;
        text-align: center;
        position: relative;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
        pointer-events: none;
      }
      
      .header h1 {
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
        position: relative;
        z-index: 1;
      }
      
      .header p {
        font-size: 16px;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }
      
      .content {
        padding: 40px 30px;
        color: #2B2B2B;
        background: #FFFFFF;
      }
      
      .welcome-text {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #2B2B2B;
      }
      
      .description {
        font-size: 16px;
        margin-bottom: 30px;
        color: #B3B3B3;
      }
      
      .verification-section {
        background: linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 100%);
        border: 2px solid #B3B3B3;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        margin: 30px 0;
        position: relative;
        overflow: hidden;
      }
      
      .verification-section::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(43, 43, 43, 0.05) 0%, transparent 70%);
        animation: pulse 3s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      
      .verification-label {
        font-size: 14px;
        color: #B3B3B3;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
        position: relative;
        z-index: 1;
      }
      
      .verification-code {
        font-size: 36px;
        font-weight: 800;
        color: #2B2B2B;
        font-family: 'Courier New', monospace;
        letter-spacing: 4px;
        margin: 10px 0;
        position: relative;
        z-index: 1;
      }
      
      .verification-note {
        font-size: 12px;
        color: #B3B3B3;
        margin-top: 10px;
        position: relative;
        z-index: 1;
      }
      
      .security-info {
        background: rgba(43, 43, 43, 0.02);
        border-left: 4px solid #B3B3B3;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 8px 8px 0;
      }
      
      .security-info p {
        font-size: 14px;
        color: #B3B3B3;
        margin: 0;
      }
      
      .footer {
        background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%);
        color: #FFFFFF;
        text-align: center;
        padding: 30px;
        font-size: 14px;
        border-top: 1px solid #D4D4D4;
      }
      
      .footer p {
        margin: 0;
        opacity: 0.8;
      }
      
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #D4D4D4, transparent);
        margin: 30px 0;
      }
      
      @media (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 12px;
        }
        
        .header, .content, .footer {
          padding: 30px 20px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .verification-code {
          font-size: 28px;
          letter-spacing: 2px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>ClothOra</h1>
        <p>Fashion Forward, Always</p>
      </div>
      
      <div class="content">
        <div class="welcome-text">Account Verification Required</div>
        
        <p class="description">
          Welcome to ClothOra! We're excited to have you join our fashion community. 
          To complete your registration and secure your account, please verify your email address.
        </p>
        
        <div class="verification-section">
          <div class="verification-label">Your Verification Code</div>
          <div class="verification-code">{verificationCode}</div>
          <div class="verification-note">Enter this code to verify your account</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="security-info">
          <p>
            <strong>Security Note:</strong> This verification code will expire in 15 minutes. 
            If you didn't create a ClothOra account, you can safely ignore this email.
          </p>
        </div>
        
        <p>
          Need help? Our support team is available 24/7 at 
          <a href="mailto:support@clothora.com" style="color: #2B2B2B; text-decoration: none; font-weight: 600;">support@clothora.com</a>
        </p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ClothOra. All rights reserved.</p>
      </div>
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
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 100%);
        margin: 0;
        padding: 20px;
        line-height: 1.6;
      }
      
      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #FFFFFF;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(43, 43, 43, 0.1);
        overflow: hidden;
        border: 1px solid #D4D4D4;
      }
      
      .header {
        background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%);
        color: #FFFFFF;
        padding: 50px 30px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="70" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="60" cy="50" r="1.2" fill="rgba(255,255,255,0.1)"/></svg>');
        pointer-events: none;
      }
      
      .header h1 {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: -0.5px;
        position: relative;
        z-index: 1;
      }
      
      .header p {
        font-size: 18px;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }
      
      .content {
        padding: 40px 30px;
        color: #2B2B2B;
        background: #FFFFFF;
      }
      
      .greeting {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 20px;
        color: #2B2B2B;
      }
      
      .welcome-message {
        font-size: 16px;
        margin-bottom: 30px;
        color: #B3B3B3;
      }
      
      .features-section {
        background: linear-gradient(135deg, #FFFFFF 0%, rgba(212, 212, 212, 0.1) 100%);
        border-radius: 12px;
        padding: 30px;
        margin: 30px 0;
        border: 1px solid #D4D4D4;
      }
      
      .features-title {
        font-size: 20px;
        font-weight: 600;
        color: #2B2B2B;
        margin-bottom: 20px;
        text-align: center;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .feature-item {
        background: #FFFFFF;
        padding: 20px;
        border-radius: 8px;
        border: 1px solid #D4D4D4;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        text-align: center;
      }
      
      .feature-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(43, 43, 43, 0.1);
      }
      
      .feature-icon {
        font-size: 32px;
        margin-bottom: 15px;
        display: block;
      }
      
      .feature-title {
        font-size: 16px;
        font-weight: 600;
        color: #2B2B2B;
        margin-bottom: 8px;
      }
      
      .feature-description {
        font-size: 14px;
        color: #B3B3B3;
        line-height: 1.4;
      }
      
      .cta-section {
        text-align: center;
        margin: 40px 0;
      }
      
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%);
        color: #FFFFFF;
        text-decoration: none;
        padding: 16px 40px;
        border-radius: 50px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(43, 43, 43, 0.2);
        position: relative;
        overflow: hidden;
      }
      
      .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }
      
      .cta-button:hover::before {
        left: 100%;
      }
      
      .cta-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(43, 43, 43, 0.3);
      }
      
      .support-section {
        background: rgba(43, 43, 43, 0.02);
        border-left: 4px solid #B3B3B3;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 8px 8px 0;
      }
      
      .support-section p {
        font-size: 14px;
        color: #B3B3B3;
        margin: 0;
      }
      
      .footer {
        background: linear-gradient(135deg, #2B2B2B 0%, #B3B3B3 100%);
        color: #FFFFFF;
        text-align: center;
        padding: 30px;
        font-size: 14px;
      }
      
      .footer p {
        margin: 0;
        opacity: 0.8;
      }
      
      .divider {
        height: 1px;
        background: linear-gradient(90deg, transparent, #D4D4D4, transparent);
        margin: 30px 0;
      }
      
      @media (max-width: 600px) {
        .container {
          margin: 10px;
          border-radius: 12px;
        }
        
        .header, .content, .footer {
          padding: 30px 20px;
        }
        
        .header h1 {
          font-size: 28px;
        }
        
        .features-grid {
          grid-template-columns: 1fr;
        }
        
        .cta-button {
          padding: 14px 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to ClothOra!</h1>
        <p>Your Fashion Journey Starts Here</p>
      </div>
      
      <div class="content">
        <div class="greeting">Hello {name}! 👋</div>
        
        <p class="welcome-message">
          Thank you for joining <strong>ClothOra</strong> – where fashion meets innovation. 
          We're thrilled to have you as part of our community and can't wait to help you 
          discover your perfect style.
        </p>
        
        <div class="features-section">
          <div class="features-title">What's Waiting For You</div>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🎯</div>
              <div class="feature-title">Curated Collections</div>
              <div class="feature-description">
                Exclusive collections handpicked by our style experts just for you
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">🛒</div>
              <div class="feature-title">Seamless Shopping</div>
              <div class="feature-description">
                Easy browsing, secure checkout, and lightning-fast delivery
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">📦</div>
              <div class="feature-title">Order Tracking</div>
              <div class="feature-description">
                Real-time updates on your orders from checkout to your doorstep
              </div>
            </div>
          </div>
        </div>
        
        <div class="cta-section">
          <a href="https://clothora.com" class="cta-button">Start Shopping Now</a>
        </div>
        
        <div class="divider"></div>
        
        <div class="support-section">
          <p>
            <strong>Need Help?</strong> Our dedicated support team is here to assist you 24/7. 
            Reach out to us at <a href="mailto:support@clothora.com" style="color: #2B2B2B; text-decoration: none; font-weight: 600;">support@clothora.com</a> 
            or visit our help center.
          </p>
        </div>
        
        <p style="text-align: center; color: #B3B3B3; font-size: 14px; margin-top: 30px;">
          Happy Shopping! 🛍️<br>
          The ClothOra Team
        </p>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ClothOra. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
`;