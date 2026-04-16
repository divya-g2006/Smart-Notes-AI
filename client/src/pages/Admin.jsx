import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  adminApprovePayment,
  adminChangeAccount,
  adminGetPendingPayments,
  adminLogin,
  adminRejectPayment,
} from "../services/adminApi";

const toErrorMessage = (e) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const [loginEmail, setLoginEmail] = useState("smartnotes298@gmail.com");
  const [loginPassword, setLoginPassword] = useState("12072006");

  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");

  const [payments, setPayments] = useState([]);
  const [busyIds, setBusyIds] = useState(() => new Set());
  const [message, setMessage] = useState("");
  const pollRef = useRef(null);

  const pendingCount = useMemo(() => payments.length, [payments.length]);

  const fetchPending = async ({ silent } = {}) => {
    try {
      if (!silent) setLoading(true);
      const data = await adminGetPendingPayments();
      setPayments(data?.payments || []);
      setLoggedIn(true);
    } catch (e) {
      console.log(e?.response?.data || e?.message);
      if (e?.response?.status === 401) {
        setLoggedIn(false);
      } else {
        setMessage(toErrorMessage(e));
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!loggedIn) return;
    pollRef.current = setInterval(() => fetchPending({ silent: true }), 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const onLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await adminLogin({ email: loginEmail, password: loginPassword });
      setAccountEmail(data?.email || loginEmail);
      setLoggedIn(true);
      await fetchPending({ silent: true });
      setMessage("Logged in.");
    } catch (err) {
      console.log(err?.response?.data || err?.message);
      setMessage(toErrorMessage(err));
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const onChangeAccount = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const data = await adminChangeAccount({
        email: accountEmail || undefined,
        password: accountPassword || undefined,
      });
      setAccountEmail(data?.email || accountEmail);
      setAccountPassword("");
      setMessage("Admin account updated.");
    } catch (err) {
      console.log(err?.response?.data || err?.message);
      setMessage(toErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const markBusy = (id, isBusy) => {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (isBusy) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const onApprove = async (paymentId) => {
    setMessage("");
    markBusy(paymentId, true);
    try {
      await adminApprovePayment(paymentId);
      setPayments((prev) => prev.filter((p) => String(p?._id) !== String(paymentId)));
    } catch (err) {
      console.log(err?.response?.data || err?.message);
      setMessage(toErrorMessage(err));
    } finally {
      markBusy(paymentId, false);
    }
  };

  const onReject = async (paymentId) => {
    setMessage("");
    markBusy(paymentId, true);
    try {
      await adminRejectPayment(paymentId);
      setPayments((prev) => prev.filter((p) => String(p?._id) !== String(paymentId)));
    } catch (err) {
      console.log(err?.response?.data || err?.message);
      setMessage(toErrorMessage(err));
    } finally {
      markBusy(paymentId, false);
    }
  };

  if (loading && !loggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-slate-300">Loading…</div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <h1 className="text-xl font-semibold">Admin Login</h1>
          <p className="text-slate-300 text-sm mt-1">Login to review pending UPI payments.</p>

          <form onSubmit={onLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 transition px-3 py-2 font-medium disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {message ? (
            <div className="mt-4 text-sm text-amber-200 bg-amber-950/40 border border-amber-900 rounded-xl p-3">
              {message}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Admin Panel</h1>
            <p className="text-slate-300 text-sm">Pending payments: {pendingCount}</p>
          </div>
          <button
            onClick={() => fetchPending()}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 hover:bg-slate-800 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {message ? (
          <div className="text-sm text-emerald-200 bg-emerald-950/30 border border-emerald-900 rounded-xl p-3">
            {message}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pending Payments</h2>
              <div className="text-xs text-slate-400">Auto-refresh every 5s</div>
            </div>

            {payments.length === 0 ? (
              <div className="mt-4 text-slate-300">No pending payments.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {payments.map((p) => {
                  const id = p?._id;
                  const user = p?.userId || {};
                  const isBusy = busyIds.has(id);
                  return (
                    <div
                      key={id}
                      className="rounded-2xl bg-slate-950 border border-slate-800 p-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-sm text-slate-300">
                            <span className="text-white font-medium">{user?.name || "User"}</span>{" "}
                            <span className="text-slate-400">({user?.email || "—"})</span>
                          </div>
                          <div className="text-sm text-slate-300">
                            Amount: <span className="text-white font-medium">₹{p?.amount}</span>{" "}
                            • Credits:{" "}
                            <span className="text-white font-medium">{p?.credits}</span>
                          </div>
                          <div className="text-sm text-slate-300">
                            Transaction ID:{" "}
                            <span className="text-white font-mono break-all">
                              {p?.transactionId}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 transition px-3 py-2 text-sm font-medium disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => onApprove(id)}
                          >
                            ✅ Approve
                          </button>
                          <button
                            className="rounded-xl bg-rose-600 hover:bg-rose-500 transition px-3 py-2 text-sm font-medium disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => onReject(id)}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <h2 className="text-lg font-semibold">Admin Account</h2>
            <p className="text-slate-300 text-sm mt-1">Update admin email/password.</p>

            <form onSubmit={onChangeAccount} className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Email</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  type="email"
                  placeholder="newadmin@gmail.com"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">New Password</label>
                <input
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 outline-none"
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  type="password"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 transition px-3 py-2 text-sm font-medium disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Saving…" : "Save changes"}
              </button>
            </form>

            <div className="mt-4 text-xs text-slate-400">
              Tip: if you changed the email/password, use the new credentials next time you log in.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
