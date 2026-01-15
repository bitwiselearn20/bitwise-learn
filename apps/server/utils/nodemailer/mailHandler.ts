import nodemailer from "nodemailer";
import { PASSWORD_EMAIL } from "./emailTemplate.ts"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


export async function handleSendMail(email: any, password: any) {

    const template = PASSWORD_EMAIL.replace("{PASSWORD}", password).replace("{EMAIL}", email);


    await transporter.sendMail({
        from: `"Auth Module" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Bitwise Learn Password",
        html: template
    });
    return true;
}

