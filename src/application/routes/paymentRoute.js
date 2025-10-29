import { Router } from "express";
import PaymentController from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // Tu middleware JWT

const router = Router();

// POST /payment/payments/confirm
router.post("/payments/confirm", authMiddleware, PaymentController.confirmPayment);

export default router;