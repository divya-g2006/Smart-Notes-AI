import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  approveManualPayment,
  approveManualPaymentByLink,
  createManualPaymentRequest,
  rejectManualPaymentByLink,
} from "../controllers/credits.controller.js";

const paymentRouter = express.Router();

// Payment submission (pending) + email to admin
paymentRouter.post("/submit", isAuth, createManualPaymentRequest);

// Backward-compatible route used by the existing client UI
paymentRouter.post("/request", isAuth, createManualPaymentRequest);

// Existing manual approval endpoint (header-based)
paymentRouter.post("/approve", approveManualPayment);

// Email link approvals
paymentRouter.get("/approve/:id", approveManualPaymentByLink);
paymentRouter.get("/reject/:id", rejectManualPaymentByLink);

export default paymentRouter;
