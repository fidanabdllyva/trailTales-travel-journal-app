const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (toEmail, userFullName, verificationLink) => {
  try {
    await transporter.sendMail({
      from: `"TrailTales" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Confirm Your TrailTales Account",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <div style="background: linear-gradient(135deg, #48b1bf, #06beb6); padding: 24px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to TrailTales</h1>
            <p style="margin: 6px 0 0;">Your personal travel journal awaits!</p>
          </div>
          
          <div style="padding: 32px; color: #333;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userFullName},</p>
            <p style="font-size: 16px; margin-bottom: 24px;">
              Thanks for joining <strong>TrailTales</strong>! To start documenting your journeys and sharing memories, please confirm your email by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" target="_blank" 
                style="background-color: #06beb6; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Confirm Email
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              If you didn't sign up for TrailTales, you can safely ignore this message.
            </p>
          </div>

          <div style="background-color: #f0f2f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} TrailTales. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const sendUnlockAccountEmail = async (
  toEmail,
  userFullName,
  unlockAccountLink
) => {
  try {
    const lockDate = new Date();
    const unlockDate = new Date(lockDate.getTime() + 10 * 60 * 1000); // 10 minutes later

    const formatDateTime = (date) =>
      date.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    await transporter.sendMail({
      from: `"TrailTales" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Account Locked - Unlock Your TrailTales Account",
      html: `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <div style="background-color: #e74c3c; padding: 24px; color: white; text-align: center;">
        <h2 style="margin: 0;">Account Temporarily Locked</h2>
      </div>

      <div style="padding: 32px; color: #333;">
        <p style="font-size: 16px;">Hi ${userFullName},</p>
        <p style="font-size: 16px;">
          Your <strong>TrailTales</strong> account has been temporarily locked due to <strong>3 unsuccessful login attempts</strong>.
        </p>
        <p style="font-size: 16px; margin-top: 16px;">
          <strong>Locked At:</strong> ${formatDateTime(lockDate)}<br/>
          <strong>Will Unlock At:</strong> ${formatDateTime(unlockDate)}
        </p>
        <p style="font-size: 16px; margin-top: 16px;">
          It will automatically unlock after 10 minutes, but you can unlock it now by clicking the button below:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${unlockAccountLink}" target="_blank" 
            style="background-color: #06beb6; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Unlock My Account
          </a>
        </div>

        <p style="font-size: 14px; color: #666;">
          If the unlock time has already passed, you can ignore this email.
          <br/>
          If you didn’t attempt to log in, please change your password and contact our support team for assistance.
        </p>
      </div>

      <div style="background-color: #f0f2f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
        &copy; ${new Date().getFullYear()} TrailTales. All rights reserved.
      </div>

    </div>
  </div>
  `,
    });

  } catch (error) {
    console.error("Error sending unlock email:", error);
  }
};

const sendForgotPasswordEmail = async (toEmail, resetPasswordLink) => {
  try {
    await transporter.sendMail({
      from: `"TrailTales" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Reset Your TrailTales Password",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; padding: 40px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <div style="background-color: #06beb6; padding: 24px; color: white; text-align: center;">
            <h2 style="margin: 0;">Reset Your Password</h2>
          </div>

          <div style="padding: 32px; color: #333;">
            <p style="font-size: 16px;">Hello Traveler,</p>
            <p style="font-size: 16px;">
              We received a request to reset the password for your <strong>TrailTales</strong> account.
            </p>
            <p style="font-size: 16px;">
              To get you back on your adventure, click the button below. The link is valid for the next 30 minutes:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetPasswordLink}" target="_blank" 
                style="background-color: #e67; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Reset Password
              </a>
            </div>

            <p style="font-size: 14px; color: #666;">
              Didn’t request this? You can safely ignore this email.
              <br/>
              If you need help, feel free to reach out to our support team.
            </p>
          </div>

          <div style="background-color: #f0f2f5; padding: 16px; text-align: center; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} TrailTales. All rights reserved.
          </div>
        </div>
      </div>
      `,
    });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};

const sendCollaboratorInviteEmail = async (toEmail, toFullName, fromFullName, listTitle, inviteLink) => {
  try {
    await transporter.sendMail({
      from: `"TrailTales" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `${fromFullName} invited you to collaborate on "${listTitle}"`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 40px;">
        <h2>Hello ${toFullName},</h2>
        <p>${fromFullName} invited you to be a collaborator on their travel list <strong>"${listTitle}"</strong>.</p>
        <p>Visit your Collaborator Requests page to view this invitation and choose to accept or decline it.</p>
        <a href="${inviteLink}" style="background-color: #06beb6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Invitation</a>
        <p>If you don’t want to collaborate, you can ignore this email.</p>
      </div>
      `,
    });
  } catch (err) {
    console.error("Error sending collaborator invite email:", err);
  }
};

const sendCollaboratorRemovedEmail = async (toEmail, toFullName, listTitle, removedBy) => {
  try {
    await transporter.sendMail({
      from: `"TrailTales" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject: `Removed from "${listTitle}" Travel List`,
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; padding: 40px;">
        <h2>Hello ${toFullName},</h2>
        <p>You have been removed as a collaborator from the travel list <strong>"${listTitle}"</strong> by ${removedBy}.</p>
        <p>If you think this was a mistake, please contact the owner.</p>
      </div>
      `,
    });
  } catch (err) {
    console.error("Error sending collaborator removed email:", err);
  }
};


module.exports = {
  sendVerificationEmail,
  sendUnlockAccountEmail,
  sendForgotPasswordEmail,
  sendCollaboratorInviteEmail,
  sendCollaboratorRemovedEmail
};