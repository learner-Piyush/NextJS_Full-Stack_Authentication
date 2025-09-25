import nodemailer from "nodemailer";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hr
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000, // 1 hr
      });
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST!,
      port: Number(process.env.MAILTRAP_SMTP_PORT!),
      auth: {
        user: process.env.MAILTRAP_SMTP_USER!,
        pass: process.env.MAILTRAP_SMTP_PASS!,
      },
    });

    const mailOptions = {
      from: "piyush@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your email"
          : emailType === "RESET"
          ? "Reset your password"
          : "Notification",
      html: `<p>Click <a href="${process.env.DOMAIN!}/${
        emailType === "VERIFY"
          ? "verify-email"
          : emailType === "RESET"
          ? "reset-password"
          : "notification"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY"
          ? "Verify your email"
          : emailType === "RESET"
          ? "Reset your password"
          : "view the notification"
      } or copy and paste the link below in your browser. <br> ${process.env
        .DOMAIN!}/${
        emailType === "VERIFY"
          ? "verify-email"
          : emailType === "RESET"
          ? "reset-password"
          : "notification"
      }?token=${hashedToken}</p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
