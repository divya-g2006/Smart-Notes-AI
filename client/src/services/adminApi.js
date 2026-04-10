import axios from "axios";
import { serverUrl } from "../config.js";

const adminClient = axios.create({
  baseURL: serverUrl,
  withCredentials: true,
});

export const adminLogin = async ({ email, password }) => {
  const { data } = await adminClient.post("/api/admin/login", { email, password });
  return data;
};

export const adminChangeAccount = async ({ email, password }) => {
  const { data } = await adminClient.patch("/api/admin/change-account", { email, password });
  return data;
};

export const adminGetPendingPayments = async () => {
  const { data } = await adminClient.get("/api/payments/pending");
  return data;
};

export const adminApprovePayment = async (paymentId) => {
  const { data } = await adminClient.put(`/api/payments/approve/${paymentId}`);
  return data;
};

export const adminRejectPayment = async (paymentId) => {
  const { data } = await adminClient.put(`/api/payments/reject/${paymentId}`);
  return data;
};
