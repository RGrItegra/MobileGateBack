import { Router } from "express";
import plateCorrectionController from "../controllers/plateCorrectionController";
import { plateCorrectionValidator } from "../validator/plateCorrectionValidator";
import { authMiddleware } from "../middlewares/authMiddleware.js"; 
const router = Router();

router.post(
  "/plate",
  authMiddleware,              
  plateCorrectionValidator,    
  plateCorrectionController.create  
);

export default router;
