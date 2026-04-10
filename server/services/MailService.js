import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const normalizeEnvValue = (value) => {
  if (value === undefined || value === null) return "";
  const trimmed = String(value).trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
};

const gmailUser = normalizeEnvValue(process.env.GMAIL_USER || process.env.EMAIL);
// App Passwords are often copied with spaces; strip whitespace to avoid 535 errors.
const gmailPass = normalizeEnvValue(process.env.GMAIL_PASS || process.env.EMAIL_PASS).replace(
  /\s+/g,
  ""
);
const adminEmail = normalizeEnvValue(process.env.ADMIN_EMAIL || "gd623995@gmail.com");
const serverUrl = normalizeEnvValue(process.env.SERVER_URL || "http://localhost:8000").replace(
  /\/+$/,
  ""
);

const transporter = nodemailer.createTransport({
  host: normalizeEnvValue(process.env.SMTP_HOST) || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // Gmail SSL
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  logger: String(process.env.MAIL_LOGGER || "").toLowerCase() === "true",
  debug: String(process.env.MAIL_DEBUG || "").toLowerCase() === "true",
});

export const createAdminApprovalToken = ({ paymentId, action }) => {
  const approvalKey = normalizeEnvValue(process.env.ADMIN_APPROVAL_KEY);
  if (!approvalKey) return "";
  return jwt.sign(
    { paymentId: String(paymentId), action: String(action) },
    approvalKey,
    { expiresIn: "7d" }
  );
};

export const verifyAdminApprovalToken = ({ token, paymentId, action }) => {
  const approvalKey = normalizeEnvValue(process.env.ADMIN_APPROVAL_KEY);
  if (!approvalKey) return { ok: true, payload: null }; // allow when not configured
  if (!token) return { ok: false, reason: "Missing token" };

  try {
    const payload = jwt.verify(String(token), approvalKey);
    if (String(payload.paymentId) !== String(paymentId)) {
      return { ok: false, reason: "Token/payment mismatch" };
    }
    if (String(payload.action) !== String(action)) {
      return { ok: false, reason: "Token action mismatch" };
    }
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "Invalid/expired token" };
  }
};

export const sendApprovalMail = async (payment) => {
  try {
    if (!gmailUser || !gmailPass) {
      console.warn(
        "[mail] Missing GMAIL_USER/GMAIL_PASS (or EMAIL/EMAIL_PASS). Skipping approval email."
      );
      return;
    }

    const approveToken = createAdminApprovalToken({ paymentId: payment._id, action: "approve" });
    const rejectToken = createAdminApprovalToken({ paymentId: payment._id, action: "reject" });

    const approveLink = `${serverUrl}/api/credit/approve/${payment._id}${
      approveToken ? `?t=${encodeURIComponent(approveToken)}` : ""
    }`;
    const rejectLink = `${serverUrl}/api/credit/reject/${payment._id}${
      rejectToken ? `?t=${encodeURIComponent(rejectToken)}` : ""
    }`;

    await transporter.sendMail({
      from: `ExamNotesAI <${gmailUser}>`,
      to: adminEmail,
      subject: "Manual UPI Payment Approval Required",
      text: `Manual UPI payment submitted\n\nPayment ID: ${payment._id}\nUser: ${payment.userId}\nAmount: INR ${payment.amount}\nCredits: ${payment.credits}\nTransaction ID: ${payment.transactionId}\n\nApprove: ${approveLink}\nReject: ${rejectLink}\n`,
      html: `
        <h2>Manual UPI Payment Approval</h2>
        <p><b>Payment ID:</b> ${payment._id}</p>
        <p><b>User:</b> ${payment.userId}</p>
        <p><b>Amount:</b> ₹${payment.amount}</p>
        <p><b>Credits:</b> ${payment.credits}</p>
        <p><b>Transaction ID (UTR):</b> ${payment.transactionId}</p>

        <a href="${approveLink}" style="
          padding:10px 20px;
          background:green;
          color:white;
          text-decoration:none;
          margin-right:10px;
          display:inline-block;
        ">✅ Approve</a>

        <a href="${rejectLink}" style="
          padding:10px 20px;
          background:red;
          color:white;
          text-decoration:none;
          display:inline-block;
        ">❌ Reject</a>
      `,
    });

    console.log(`[mail] Approval email sent to ${adminEmail} for payment ${payment._id}`);
  } catch (error) {
    console.error("[mail] Error sending approval email:", error);
  }
};

