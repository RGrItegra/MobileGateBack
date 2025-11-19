import { Router } from "express";
import plateCorrectionController from "../controllers/plateCorrectionController";
import { plateCorrectionValidator } from "../validator/plateCorrectionValidator";

const router = Router();

router.post(
  "/plate",
  plateCorrectionValidator,
  plateCorrectionController.create
);

export default router;
