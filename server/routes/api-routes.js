import { Router } from "express";
import { CreateHttpError } from "../services/utility-services.js";
import UsersRouter from "./users-routes.js";

const router = Router();

router.use("/users", UsersRouter);
router.use("*", (req, res, next) => next(CreateHttpError(404, "API-Route not found: ")));

export default router;
