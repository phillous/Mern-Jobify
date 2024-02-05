import {
  UnauthenticatedError,
  UnauthorizedError,
  BadRequestError,
} from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("Invalid user");
  }
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "65b58cec5cd5831d7327aee6";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Invalid user");
  }
};

export const authorizePermission = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.roles)) {
      throw new UnauthorizedError("Unauthorised to access this route");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User, Read Only!");
  next();
};
