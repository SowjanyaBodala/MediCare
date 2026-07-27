// Simple mailer stub: logs emails to the console.
// Replace later with nodemailer/SMTP when ready.

async function sendMail({ to, subject, text, html }) {
  const payload = { to, subject, text, html };
  console.log("[MAIL] Outgoing email →", JSON.stringify(payload, null, 2));
  return { success: true };
}

module.exports = { sendMail };




