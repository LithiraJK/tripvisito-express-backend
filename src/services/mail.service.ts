import nodemailer from "nodemailer";
import { env } from "../config/env";

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const mailOptions = {
      from: `"Tripvisito" <${env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${to}`);
  } catch (error) {
    console.error("Email Service Error:", error);
  }
};