const nodemailer = require("nodemailer");

/**
 * Creates a reusable transporter.
 * Uses Gmail by default — swap `service` for other providers.
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an App Password, not your real password
    },
  });

/**
 * Sends a notification email to the portfolio owner
 * when a new contact form message is submitted.
 */
const sendContactNotification = async ({ name, email, message }) => {
  // If email credentials aren't configured, skip silently in dev
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials not set — skipping notification email.");
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `📬 New message from ${name}`,
    html: `
      <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #0d1320; color: #e2e8f0; padding: 2rem; border-radius: 8px; border: 1px solid #1e293b;">
        <h2 style="color: #00d4ff; margin-bottom: 1.5rem; border-bottom: 1px solid #1e293b; padding-bottom: 1rem;">
          New Portfolio Message
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b; width: 80px;">From</td>
            <td style="padding: 0.5rem 0; color: #e2e8f0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b;">Email</td>
            <td style="padding: 0.5rem 0;">
              <a href="mailto:${email}" style="color: #00d4ff;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 0.5rem 0; color: #64748b; vertical-align: top;">Message</td>
            <td style="padding: 0.5rem 0; color: #e2e8f0; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <p style="margin-top: 2rem; color: #334155; font-size: 0.75rem;">
          Sent via your portfolio contact form · ${new Date().toUTCString()}
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Notification email sent to ${mailOptions.to}`);
};

module.exports = { sendContactNotification };
