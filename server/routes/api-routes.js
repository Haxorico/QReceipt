import { Router } from "express";
import { CreateHttpError } from "../services/utility-services.js";
import UsersRouter from "./user-routes.js";
import { ErrorHandler } from "../middlewares/error-handler.js";

const router = Router();

router.use("/users", UsersRouter);
router.use("*", (req, res, next) => next(CreateHttpError(404, "API-Route not found: ")));

//TOASK why this works here but not in index.js?
router.use(ErrorHandler);

export default router;
