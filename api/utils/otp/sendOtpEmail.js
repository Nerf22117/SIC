// Importing the file system module
import fs from "fs";

// Importing the nodemailer configuration
import { transporter } from "../../config/nodeMailer.config.js";

/**
 * Sends an OTP email to the user.
 *
 * @param {string} email - The email address of the user.
 * @param {string} otp - The OTP to be sent.
 * @param {string} type - The type of OTP (e.g., "verification", "passwordReset").
 */
const sendOtpEmail = async (email, otp, type = "verification") => {
  let templatePath;

  // Determine the template path based on the type of OTP
  if (type === "passwordReset") {
    templatePath = "html/password_reset.html";
  } else {
    templatePath = "html/email_verification.html";
  }

  const emailTemplate = fs.readFileSync(templatePath, "utf8");
  const emailBody = emailTemplate.replace("{{otp}}", otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject:
      type === "passwordReset" ? "Reset your password" : "Verify your email",
    html: emailBody,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOtpEmail;
