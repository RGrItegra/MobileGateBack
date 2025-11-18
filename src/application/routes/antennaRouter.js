import { Router } from "express";
import AntennaController from "../controllers/antenaController";

const router = Router();

router.get(
  "/salidas",
  (req, res) => AntennaController.getAntennasTypeOne(req, res)
);

export default router;
