import { Router } from "express";
import plateCorrectionController from "../controllers/plateCorrectionController";
import { plateCorrectionValidator } from "../validator/plateCorrectionValidator";
import { authMiddleware } from "../middlewares/authMiddleware.js"; 
const router = Router();

router.post(
  "/plate",
  authMiddleware,              // ← 1. Valida token y sesión
  plateCorrectionValidator,    // ← 2. Valida datos del body
  plateCorrectionController.create  // ← 3. Ejecuta el controller
);

export default router;
