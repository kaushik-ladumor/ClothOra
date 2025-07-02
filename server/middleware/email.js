import { transporter } from "./email.config.js";
import { Verification_Email_Template, Welcome_Email_Template } from "./emailTemplete.js";


export const sendVerificationCode = async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"sendByClothora 🎋" <kaushikladumor80@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
};

export const senWelcomeEmail = async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"sendByClothora 🎋" <kaushikladumor80@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}