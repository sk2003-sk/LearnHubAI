import { Router } from "express";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import User from "../models/User.js";
import { config } from "../config.js";
import { ApiError, asyncHandler, parseIntParam } from "../utils/http.js";
import {
  activationCode,
  clearRefreshCookieOptions,
  randomToken,
  REFRESH_COOKIE,
  refreshCookieOptions,
  resetTokenHash,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import { userJSON } from "../utils/serializers.js";
import { optionalAuth, requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireString(value, field, { min = 1, max = 500 } = {}) {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < min || text.length > max) {
    throw new ApiError(400, `${field} is required.`);
  }
  return text;
}

function normalizeEmail(value) {
  const email = requireString(value, "Email", { max: 254 }).toLowerCase();
  if (!EMAIL_REGEX.test(email)) throw new ApiError(400, "Enter a valid email address.");
  return email;
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long.");
  }
  return password;
}

async function issueSession(user, res) {
  const accessToken = signAccessToken(user);
  const { token: refreshToken, jti } = signRefreshToken(user);

  const recentTokens = (user.refreshTokens || []).slice(-9);
  user.refreshTokens = [...recentTokens, { jti, createdAt: new Date() }];
  await user.save();

  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions());
  return { accessToken, refreshToken };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = requireString(req.body?.name, "Name", { max: 120 });
    const email = normalizeEmail(req.body?.email);
    const password = validatePassword(req.body?.password);

    let user = await User.findOne({ email });
    if (user?.isVerified) {
      throw new ApiError(409, "An account with this email already exists. Try signing in.");
    }

    if (!user) {
      user = new User({ name, email, role: "user" });
    }

    user.name = name;
    await user.setPassword(password);
    user.activationToken = randomToken(24);
    user.activationCode = activationCode();
    await user.save();

    res.status(201).json({
      success: true,
      message:
        "Account created. Use the activation code below to activate your account.",
      email,
      activationToken: user.activationToken,
      activationCode: user.activationCode,
    });
  }),
);

router.post(
  "/activate-user",
  asyncHandler(async (req, res) => {
    const token =
      req.body?.activation_token || req.body?.activationToken || req.body?.token;
    const code = String(
      req.body?.activation_code ?? req.body?.activationCode ?? req.body?.code ?? "",
    ).trim();

    if (!token || !code) {
      throw new ApiError(400, "Activation token and code are required.");
    }

    const user = await User.findOne({ activationToken: token }).select(
      "+activationToken +activationCode",
    );

    if (!user) throw new ApiError(400, "Invalid activation link.");
    if (user.isVerified) {
      return res.json({ success: true, message: "Account already activated." });
    }
    if (String(user.activationCode) !== code) {
      throw new ApiError(400, "The activation code is incorrect.");
    }

    user.isVerified = true;
    user.activationToken = undefined;
    user.activationCode = undefined;
    await user.save();

    res.json({ success: true, message: "Account activated. You can sign in now." });
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === "string" ? req.body.password : "";

    const user = await User.findOne({ email }).select(
      "+password +activationToken +activationCode +refreshTokens",
    );

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (!user.isVerified) {
      throw new ApiError(403, "Please activate your account before signing in.", {
        activationToken: user.activationToken,
        activationCode: user.activationCode,
        email: user.email,
      });
    }

    const { accessToken } = await issueSession(user, res);

    res.json({
      success: true,
      message: "Signed in successfully.",
      accessToken,
      token: accessToken,
      user: userJSON(user),
    });
  }),
);

router.get(
  "/refreshtoken",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new ApiError(401, "No active session.");

    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new ApiError(401, "Your session has expired. Please sign in again.");
    }

    const user = await User.findById(payload.sub).select("+refreshTokens");
    if (!user) throw new ApiError(401, "Account not found.");

    const tokens = user.refreshTokens || [];
    if (!tokens.some((entry) => entry.jti === payload.jti)) {
      throw new ApiError(401, "Your session is no longer valid. Please sign in again.");
    }

    user.refreshTokens = tokens.filter((entry) => entry.jti !== payload.jti);
    const accessToken = signAccessToken(user);
    const rotated = signRefreshToken(user);
    user.refreshTokens = [
      ...user.refreshTokens.slice(-9),
      { jti: rotated.jti, createdAt: new Date() },
    ];
    await user.save();

    res.cookie(REFRESH_COOKIE, rotated.token, refreshCookieOptions());
    res.json({
      success: true,
      accessToken,
      token: accessToken,
      user: userJSON(user),
    });
  }),
);

router.get(
  "/logout",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) {
      try {
        const payload = verifyRefreshToken(token);
        const user = await User.findById(payload.sub).select("+refreshTokens");
        if (user) {
          user.refreshTokens = (user.refreshTokens || []).filter(
            (entry) => entry.jti !== payload.jti,
          );
          await user.save();
        }
      } catch {
        // Expired or invalid refresh token: clearing the cookie is enough.
      }
    }

    res.clearCookie(REFRESH_COOKIE, clearRefreshCookieOptions());
    res.json({ success: true, message: "Signed out." });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ success: true, user: userJSON(req.user) });
  }),
);

router.post(
  "/social-auth",
  asyncHandler(async () => {
    throw new ApiError(
      501,
      "Social sign-in is not configured. Please use email and password.",
    );
  }),
);

router.put(
  "/update-user-info",
  requireAuth,
  asyncHandler(async (req, res) => {
    const name = requireString(req.body?.name, "Name", { max: 120 });
    const email = normalizeEmail(req.body?.email);

    const conflict = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (conflict) throw new ApiError(409, "That email is already in use.");

    req.user.name = name;
    req.user.email = email;
    await req.user.save();

    res.json({ success: true, message: "Profile updated.", user: userJSON(req.user) });
  }),
);

router.put(
  "/update-user-password",
  requireAuth,
  asyncHandler(async (req, res) => {
    const oldPassword = typeof req.body?.oldPassword === "string" ? req.body.oldPassword : "";
    const newPassword = validatePassword(req.body?.newPassword);

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(oldPassword))) {
      throw new ApiError(400, "Your current password is incorrect.");
    }

    await user.setPassword(newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated." });
  }),
);

router.put(
  "/update-user-profile-picture",
  requireAuth,
  asyncHandler(async (req, res) => {
    const value = req.body?.avatar;
    const url =
      typeof value === "string"
        ? value
        : typeof value?.url === "string"
          ? value.url
          : "";

    if (!url) throw new ApiError(400, "An image is required.");
    if (url.length > 4_000_000) {
      throw new ApiError(413, "That image is too large. Please use a smaller file.");
    }
    if (!/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(url) && !/^https?:\/\//i.test(url)) {
      throw new ApiError(400, "Only image files are supported.");
    }

    req.user.avatar = { url };
    await req.user.save();

    res.json({ success: true, message: "Profile picture updated.", user: userJSON(req.user) });
  }),
);

router.post(
  "/2fa/setup",
  requireAuth,
  asyncHandler(async (req, res) => {
    const secret = speakeasy.generateSecret({
      name: `LearnHub (${req.user.email})`,
      issuer: "LearnHub",
      length: 20,
    });

    const otpauthUrl = secret.otpauth_url;
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    req.user.twoFactor = { enabled: false, secret: secret.base32 };
    await req.user.save();

    res.json({
      success: true,
      qrCode,
      qrCodeUrl: qrCode,
      qr: qrCode,
      secret: secret.base32,
      otpauthUrl,
    });
  }),
);

function verifyTotp(secret, token) {
  return speakeasy.totp.verify({
    secret,
    encoding: "base32",
    token: String(token || "").trim(),
    window: 1,
  });
}

router.post(
  "/2fa/verify",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+twoFactor.secret");
    if (!user.twoFactor?.secret) {
      throw new ApiError(400, "Start two-factor setup first.");
    }
    if (!verifyTotp(user.twoFactor.secret, req.body?.token)) {
      throw new ApiError(400, "That code is invalid. Please try again.");
    }

    user.twoFactor.enabled = true;
    await user.save();

    res.json({ success: true, message: "Two-factor authentication enabled." });
  }),
);

router.post(
  "/2fa/disable",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("+twoFactor.secret");
    if (!user.twoFactor?.enabled) {
      return res.json({ success: true, message: "Two-factor authentication is already off." });
    }
    if (!verifyTotp(user.twoFactor.secret, req.body?.token)) {
      throw new ApiError(400, "That code is invalid. Please try again.");
    }

    user.twoFactor = { enabled: false, secret: undefined };
    await user.save();

    res.json({ success: true, message: "Two-factor authentication disabled." });
  }),
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const user = await User.findOne({ email });

    let plainResetToken = null;
    if (user) {
      plainResetToken = randomToken(32);
      user.resetTokenHash = resetTokenHash(plainResetToken);
      user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const origin = config.clientOrigins[0] || "http://localhost:5173";
      console.log(
        `[auth] password reset link: ${origin}/reset-password?token=${plainResetToken}`,
      );
    }

    res.json({
      success: true,
      message: "If that email is registered, a reset link has been generated.",
      ...(config.exposeResetToken && plainResetToken
        ? { resetToken: plainResetToken }
        : {}),
    });
  }),
);

router.post(
  "/reset-password",
  asyncHandler(async (req, res) => {
    const token = requireString(req.body?.token, "Reset token", { max: 200 });
    const newPassword = validatePassword(req.body?.newPassword);

    const user = await User.findOne({
      resetTokenHash: resetTokenHash(token),
      resetTokenExpires: { $gt: new Date() },
    }).select("+password +resetTokenHash +resetTokenExpires");

    if (!user) throw new ApiError(400, "This reset link is invalid or has expired.");

    await user.setPassword(newPassword);
    user.resetTokenHash = undefined;
    user.resetTokenExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    res.json({ success: true, message: "Password reset. You can sign in now." });
  }),
);

router.get(
  "/get-all-user-dashboard",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const limit = parseIntParam(req.query.limit, 50);
    const page = Math.max(parseIntParam(req.query.page, 1) - 1, 0);

    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(page * limit).limit(limit),
      User.countDocuments(),
    ]);

    res.json({
      success: true,
      users: users.map(userJSON),
      total,
      page: page + 1,
      limit,
    });
  }),
);

router.put(
  "/update-user-roles",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    const { id, role } = req.body || {};
    if (!["user", "instructor", "admin"].includes(role)) {
      throw new ApiError(400, "Invalid role.");
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) throw new ApiError(404, "User not found.");
    res.json({ success: true, message: "Role updated.", user: userJSON(user) });
  }),
);

router.delete(
  "/delete-user/:id",
  requireRole("admin"),
  asyncHandler(async (req, res) => {
    if (String(req.user._id) === String(req.params.id)) {
      throw new ApiError(400, "You cannot delete your own account.");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    res.json({ success: true, message: "User deleted." });
  }),
);

router.get(
  "/session",
  optionalAuth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      authenticated: Boolean(req.user),
      user: req.user ? userJSON(req.user) : null,
    });
  }),
);

export default router;
