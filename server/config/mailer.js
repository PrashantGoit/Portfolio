// Uses Resend over HTTPS so contact notifications work on hosting providers that block SMTP ports.
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getFromAddress = () =>
  process.env.EMAIL_FROM || "Portfolio Contact <onboarding@resend.dev>";

const sendContactEmail = async ({ name, email, message }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured: missing RESEND_API_KEY.");
  }

  if (!process.env.EMAIL_TO) {
    throw new Error("Email delivery is not configured: missing EMAIL_TO.");
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");
  const subjectName = String(name).replace(/\r?\n/g, " ").trim();
  const fromAddress = getFromAddress();

  try {
    const result = await resend.emails.send({
      from: fromAddress,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission from ${subjectName}`,
      reply_to: email,
      html: `
        <div style="margin:0;background:#f4f7fb;padding:24px;font-family:Arial,sans-serif;color:#0f172a;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:16px;overflow:hidden;">
            <div style="padding:24px 28px;background:#0f172a;color:#ffffff;">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#93c5fd;">Portfolio Contact</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;">New Contact Form Submission</h1>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#334155;">
                You received a new message from your portfolio contact form.
              </p>
              <div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <div style="display:block;padding:14px 18px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Name</div>
                  <div style="margin-top:6px;font-size:15px;color:#0f172a;">${safeName}</div>
                </div>
                <div style="display:block;padding:14px 18px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Email</div>
                  <div style="margin-top:6px;font-size:15px;">
                    <a href="mailto:${safeEmail}" style="color:#2563eb;text-decoration:none;">${safeEmail}</a>
                  </div>
                </div>
                <div style="display:block;padding:14px 18px;background:#f8fafc;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;">Message</div>
                  <div style="margin-top:10px;font-size:15px;line-height:1.7;color:#0f172a;white-space:normal;">${safeMessage}</div>
                </div>
              </div>
              <p style="margin:0;font-size:12px;color:#64748b;">
                Sent from the portfolio contact form on ${new Date().toUTCString()}.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.error) {
      const usingOnboardingSender = fromAddress.includes("onboarding@resend.dev");
      const helpText = usingOnboardingSender
        ? "Resend's onboarding sender can only deliver to your Resend account email until you verify a domain. Either verify a domain and update EMAIL_FROM, or change EMAIL_TO to your Resend account email for local testing."
        : "Verify that EMAIL_FROM is a sender address from a domain verified in Resend.";

      throw new Error(`${result.error.message} ${helpText}`);
    }

    return result;
  } catch (error) {
    throw new Error(`Failed to send contact email via Resend: ${error.message}`);
  }
};

module.exports = { sendContactEmail };
