import bcrypt from "bcryptjs";
import AdminModel from "../models/admin.model.js";

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

export const ensureDefaultAdmin = async () => {
  const existingCount = await AdminModel.countDocuments();
  if (existingCount > 0) return;

  const defaultEmail =
    normalizeEnvValue(process.env.ADMIN_DEFAULT_EMAIL) || "smartnotes298@gmail.com";
  const defaultPassword =
    normalizeEnvValue(process.env.ADMIN_DEFAULT_PASSWORD) || "12072006";

  const passwordHash = await bcrypt.hash(defaultPassword, 10);
  await AdminModel.create({ email: defaultEmail.toLowerCase(), passwordHash });

  console.log(`[admin] Default admin created: ${defaultEmail}`);
};

