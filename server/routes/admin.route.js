import express from "express";
import isAdminAuth from "../middleware/isAdminAuth.js";
import {
  adminLogin,
  approvePendingPayment,
  changeAdminAccount,
  listPendingPayments,
  rejectPendingPayment,
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.patch("/change-account", isAdminAuth, changeAdminAccount);

adminRouter.get("/payments/pending", isAdminAuth, listPendingPayments);
adminRouter.patch("/payments/approve/:id", isAdminAuth, approvePendingPayment);
adminRouter.patch("/payments/reject/:id", isAdminAuth, rejectPendingPayment);

export default adminRouter;

