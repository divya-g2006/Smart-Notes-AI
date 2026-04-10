import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import { sendApprovalMail, verifyAdminApprovalToken } from "../services/MailService.js";

dotenv.config();

// Keep the existing credit plans exactly
const CREDIT_MAP = {
  100: 50,
  200: 120,
  500: 300,
};

// POST /api/credit/request  (backward compatible)
// POST /api/credit/submit   (new)
// Saves a manual UPI payment request as "pending" (does NOT add credits)
export const createManualPaymentRequest = async (req, res) => {
  try {
    const { userId, amount, credits, transactionId } = req.body || {};

    if (!transactionId || !String(transactionId).trim()) {
      return res.status(400).json({ message: "Transaction ID (UTR) is required" });
    }

    const requestedAmount = Number(amount);
    const expectedCredits = CREDIT_MAP[requestedAmount];
    if (!expectedCredits) {
      return res.status(400).json({ message: "Invalid credit plan" });
    }

    // Client may send userId/credits, but we bind to authenticated user + server-side map
    if (userId && String(userId) !== String(req.userId)) {
      return res.status(403).json({ message: "Invalid user" });
    }
    if (typeof credits !== "undefined" && Number(credits) !== expectedCredits) {
      return res.status(400).json({ message: "Invalid credits for selected plan" });
    }

    const payment = await Payment.create({
      userId: req.userId,
      amount: requestedAmount,
      credits: expectedCredits,
      transactionId: String(transactionId).trim(),
      status: "pending",
    });

    console.log(`[credit] Payment submitted (pending): ${payment._id} user=${payment.userId}`);
    await sendApprovalMail(payment);

    return res.status(201).json({
      message: "Payment submitted. Waiting for verification.",
      paymentId: payment._id,
      status: payment.status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Payment request error" });
  }
};

const approvePayment = async (paymentId) => {
  const session = await mongoose.startSession();
  try {
    let result = null;
    await session.withTransaction(async () => {
      // Only allow one approver to transition pending -> approved.
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId, status: "pending" },
        { $set: { status: "approved", decidedAt: new Date() } },
        { new: true, session }
      );

      if (!payment) {
        const existing = await Payment.findById(paymentId).session(session);
        if (!existing) {
          const err = new Error("Payment not found");
          err.statusCode = 404;
          throw err;
        }
        if (existing.status === "approved") {
          result = { payment: existing, user: null, already: true };
          return;
        }
        if (existing.status === "rejected") {
          const err = new Error("Payment already rejected");
          err.statusCode = 400;
          throw err;
        }
        const err = new Error("Payment could not be approved");
        err.statusCode = 409;
        throw err;
      }

      const creditsToAdd = Number(payment.credits);
      if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
        const err = new Error("Invalid payment credits");
        err.statusCode = 400;
        throw err;
      }

      const user = await UserModel.findByIdAndUpdate(
        payment.userId,
        {
          $inc: { credits: creditsToAdd },
          $set: { isCreditAvailable: true },
        },
        { new: true, session }
      );

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      result = { payment, user, already: false };
    });

    return result;
  } finally {
    session.endSession();
  }
};

// GET /api/credit/approve/:id
export const approveManualPaymentByLink = async (req, res) => {
  try {
    const paymentId = req.params.paymentId || req.params.id;
    const token = req.query.t;
    const tokenCheck = verifyAdminApprovalToken({ token, paymentId, action: "approve" });
    if (!tokenCheck.ok) {
      return res.status(403).send("Forbidden");
    }

    const { already } = await approvePayment(paymentId);

    return res.status(200).send(already ? "Already approved" : "Payment approved and credits added");
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message || "Approve failed");
  }
};

// GET /api/credit/reject/:id
export const rejectManualPaymentByLink = async (req, res) => {
  try {
    const paymentId = req.params.paymentId || req.params.id;
    const token = req.query.t;
    const tokenCheck = verifyAdminApprovalToken({ token, paymentId, action: "reject" });
    if (!tokenCheck.ok) {
      return res.status(403).send("Forbidden");
    }

    const session = await mongoose.startSession();
    try {
      let message = "";
      await session.withTransaction(async () => {
        const payment = await Payment.findOneAndUpdate(
          { _id: paymentId, status: "pending" },
          { $set: { status: "rejected", decidedAt: new Date() } },
          { new: true, session }
        );

        if (!payment) {
          const existing = await Payment.findById(paymentId).session(session);
          if (!existing) {
            const err = new Error("Payment not found");
            err.statusCode = 404;
            throw err;
          }
          if (existing.status === "approved") {
            const err = new Error("Payment already approved (cannot reject)");
            err.statusCode = 400;
            throw err;
          }
          if (existing.status === "rejected") {
            message = "Payment already rejected";
            return;
          }
          const err = new Error("Payment could not be rejected");
          err.statusCode = 409;
          throw err;
        }

        message = "Payment rejected";
      });

      return res.status(200).send(message || "Payment rejected");
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(error.statusCode || 500).send(error.message || "Reject failed");
  }
};

// POST /api/credit/approve (kept for existing usage)
// Admin approves a pending payment -> credits are added and payment marked approved
export const approveManualPayment = async (req, res) => {
  try {
    const adminKey = req.headers["x-admin-key"];
    if (!process.env.ADMIN_APPROVAL_KEY) {
      return res.status(500).json({ message: "ADMIN_APPROVAL_KEY missing in .env" });
    }
    if (String(adminKey || "") !== String(process.env.ADMIN_APPROVAL_KEY)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { paymentId } = req.body || {};
    if (!paymentId) {
      return res.status(400).json({ message: "paymentId is required" });
    }
    const { user, already } = await approvePayment(paymentId);

    return res.status(200).json({
      message: already ? "Already approved" : "Payment approved. Credits added.",
      creditsLeft: user ? user.credits : undefined,
    });
  } catch (error) {
    return res.status(500).json({ message: "Approval error" });
  }
};
