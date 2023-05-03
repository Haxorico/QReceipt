import User from "../models/user.js";
import { CreateHttpError } from "../services/utility-services.js";

export const CheckToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) return next();
    req.user = await User.verify(authorization);
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

export const UsersOnly = (req, res, next) => {
  try {
    if (req.user) next();
    CreateHttpError(401, "No Premissions");
  } catch (err) {
    next(err);
  }
};
