import { Router } from "express";

const router = Router();

import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validationMiddlewre.js";
import { login, register, logout } from "../controllers/authController.js";

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.get("/logout", logout);

export default router;
