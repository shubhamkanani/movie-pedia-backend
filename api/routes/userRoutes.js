import { Router } from "express";

/* Controller */
import Users from "../controllers/userController.js";

const router = Router();

/* Method */
router.post("/login", Users.login);
router.post("/registration", Users.register);

export default router;
