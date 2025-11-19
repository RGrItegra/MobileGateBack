import { validationResult } from "express-validator";
import plateCorrectionService from "../services/plateCorrectionService";

class PlateCorrectionController {
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { gerId, cor_plate } = req.body;

      // CORREGIDO: Enviar valores individuales, NO un objeto
      const correction = await plateCorrectionService.createCorrection(
        gerId,
        cor_plate
      );

      res.status(201).json({
        message: "Corrección de placa creada correctamente",
        data: correction,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  }
}

export default new PlateCorrectionController();