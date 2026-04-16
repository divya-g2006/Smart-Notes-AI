import express from "express";
import isAdminAuth from "../middleware/isAdminAuth.js";
import {
  approvePendingPayment,
  listPendingPayments,
  rejectPendingPayment,
} from "../controllers/admin.controller.js";

const paymentsRouter = express.Router();

// Aliases matching common client implementations
paymentsRouter.get("/pending", isAdminAuth, listPendingPayments);
paymentsRouter.put("/approve/:id", isAdminAuth, approvePendingPayment);
paymentsRouter.put("/reject/:id", isAdminAuth, rejectPendingPayment);

export default paymentsRouter;

