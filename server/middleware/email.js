import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./emailTemplete.js";

// Send Verification Email
export const sendVerificationCode = async (email, verificationCode) => {
  try {
    const response = await transporter.sendMail({
      from: '"sendByClothora 🎋" <kaushikladumor80@gmail.com>',
      to: email,
      subject: "Verify your Email",
      text: "Verify your Email",
      html: Verification_Email_Template.replace("{verificationCode}", verificationCode),
    });
    console.log("Verification email sent successfully", response);
  } catch (error) {
    console.error("Verification email error:", error);
  }
};

// Send Welcome Email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const response = await transporter.sendMail({
      from: '"sendByClothora 🎋" <kaushikladumor80@gmail.com>',
      to: email,
      subject: "Welcome to ClothOra!",
      text: "Welcome Email",
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error("Welcome email error:", error);
  }
};
