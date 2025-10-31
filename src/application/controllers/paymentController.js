import paymentService from "../services/paymentService.js";

class PaymentController {
  static async confirmPayment(req, res) {
    try {
      //console.log("[DEBUG Controller] Body:", req.body);
      //console.log("[DEBUG Controller] User:", req.user);

      const result = await paymentService.confirmPayment(req);
      res.status(201).json(result);
    } catch (error) {
      console.error("[ERROR Controller]", error.message);
      res.status(500).json({ 
        error: error.message || "Error en confirmación de pago" 
      });
    }
  }
}

export default PaymentController;