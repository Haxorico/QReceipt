import { Router } from "express";
import { List, Login } from "../controllers/user-controllers.js";
import { UsersOnly } from "../middlewares/auth.js";

const router = Router();

router.get("/list", UsersOnly, List);
router.post("/login", Login);

export default router;
