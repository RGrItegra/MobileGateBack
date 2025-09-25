import paymentService from "../services/paymentService.js";

class PaymentController {
  static async confirmPayment(req, res) {
    try {
      const result = await paymentService.confirmPayment(req);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error en confirmPayment:", error);
      res.status(500).json({ error: error.message || "Error en confirmación de pago" });
    }
  }
}

export default PaymentController;
