import antennaService from "../services/antennaService.js";

class AntennaController {
  async getAntennasTypeOne(req, res) {
    const result = await antennaService.getAntennasTypeOne();

    if (!result.success) {
      return res.status(500).json({
        message: "Error al obtener antenas",
        error: result.error,
        details: result.details,
      });
    }

    return res.status(200).json({
      message: "Antenas encontradas",
      data: result.antennas,
    });
  }
}

export default new AntennaController();
