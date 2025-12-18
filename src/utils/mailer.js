import "dotenv/config";
import nodemailer from "nodemailer";
import * as htmlTemplate from "./htmlTemplate.js";
import { logMessage } from "./globalFunction.js";
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_EMAIL,
  APPLICATION_NAME,
  APPLICATION_LOGO_URL,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: true,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

export const otpVerificationProcessTemplate = async (email, data) => {
  try {
    await transporter.sendMail({
      from: SMTP_EMAIL,
      to: email,
      subject: `[${APPLICATION_NAME}] Otp Verification - ${new Date()}`,
      html: htmlTemplate.otpVerificationProcess({
        ...data,
        company_name: APPLICATION_NAME,
        company_logo_url: APPLICATION_LOGO_URL,
      }),
    });
    return { success: true };
  } catch (error) {
    logMessage("Email error:", error, "error");
    return { success: false, error: error.message };
  }
};
