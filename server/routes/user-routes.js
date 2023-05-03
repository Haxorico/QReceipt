import { Router } from "express";
import { List, Login } from "../controllers/user-controllers.js";
// import { UsersOnly } from "../middleware/auth.js";

const router = Router();

router.post("/login", Login);
router.get("/list", List);

export default router;
