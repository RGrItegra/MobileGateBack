import express from "express";
import { validateSessionMiddleware } from "../middlewares/validateSessionMiddleware.js";
import PaymentController from "../controllers/paymentController.js";

const router = express.Router();
//fdhgj
//fhdjgfgk
// Confirmación de pago
router.post(
  "/payments/confirm",
  validateSessionMiddleware,
  (req, res) => PaymentController.confirmPayment(req, res)
);

export default router;
