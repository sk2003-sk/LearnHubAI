import User from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";
import { ApiError, asyncHandler } from "../utils/http.js";

function bearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

const loadUser = asyncHandler(async (req, res, next) => {
  const token = bearerToken(req);
  if (!token) throw new ApiError(401, "Authentication required.");

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Your session has expired. Please sign in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new ApiError(401, "Account not found.");

  req.user = user;
  next();
});

export const requireAuth = loadUser;

export const optionalAuth = async (req, res, next) => {
  const token = bearerToken(req);
  if (!token) return next();
  try {
    const payload = verifyAccessToken(token);
    req.user = await User.findById(payload.sub);
  } catch {
    req.user = null;
  }
  next();
};

export const requireRole = (...roles) => [
  loadUser,
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to do that."));
    }
    next();
  },
];
