import { Router } from "express";
import AntennaController from "../controllers/antenaController";
import { authMiddleware } from "../middlewares/authMiddleware.js"; 

const router = Router();

router.get(
  "/salidas",
   authMiddleware,
  (req, res) => AntennaController.getAntennasTypeOne(req, res)
);

export default router;
