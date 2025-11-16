// utils/email.js
const nodemailer = require("nodemailer");

let transporter = null;
let transporterChecked = false;

function getSmtpCredentials() {
  // prefer EMAIL_USER/EMAIL_PASS (yang lebih deskriptif), fallback ke SMTP_*
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || null;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || null;
  return { user, pass };
}

function createTransporter() {
  if (transporter) return transporter;

  const { user, pass } = getSmtpCredentials();

  if (!user || !pass) {
    // leave transporter null; sendEmail akan menolak jika dipanggil
    console.warn(
      "EMAIL: SMTP credentials not found (EMAIL_USER/EMAIL_PASS or SMTP_USER/SMTP_PASS). Email disabled until configured."
    );
    transporter = null;
    transporterChecked = true;
    return null;
  }

  // Optional: allow specifying EMAIL_SERVICE='gmail' to use nodemailer's service shortcut
  const service = process.env.EMAIL_SERVICE || null;
  const host = process.env.SMTP_HOST || null;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  let config;
  if (service) {
    config = { service, auth: { user, pass } };
  } else if (host) {
    config = {
      host,
      port: port || 587,
      secure: secure || false,
      auth: { user, pass }
    };
  } else {
    // default fallback: gmail via host
    config = {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass }
    };
  }

  transporter = nodemailer.createTransport(config);

  // verify once (async) and log result
  transporter
    .verify()
    .then(() => {
      console.log(
        "EMAIL: SMTP transporter verified and ready to send messages."
      );
    })
    .catch((err) => {
      console.error("EMAIL: transporter verify failed:", err.message || err);
    })
    .finally(() => {
      transporterChecked = true;
    });

  return transporter;
}

/**
 * sendEmail({ to, subject, text, html, from })
 * throws Error with code 'NO_SMTP_CREDS' if SMTP creds missing
 */
async function sendEmail({ to, subject, text, html, from }) {
  const t = createTransporter();
  if (!t) {
    const err = new Error(
      "SMTP credentials not configured. Set EMAIL_USER/EMAIL_PASS or SMTP_USER/SMTP_PASS in .env"
    );
    err.code = "NO_SMTP_CREDS";
    throw err;
  }

  const mailOptions = {
    from:
      from ||
      process.env.EMAIL_FROM ||
      `"No Reply" <${process.env.EMAIL_USER || process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  };

  try {
    const info = await t.sendMail(mailOptions);
    // info contains accepted/rejected etc.
    return info;
  } catch (err) {
    // bubble up error but log first
    console.error("EMAIL: sendMail error:", err.message || err);
    throw err;
  }
}

module.exports = { sendEmail, createTransporter };
