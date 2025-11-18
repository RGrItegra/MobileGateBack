import antennaRepository from "../../domain/repositories/antennaRepository";

class AntennaService {
  async getAntennasTypeOne() {
    try {
      const antennas = await antennaRepository.getAntennasTypeOne();
      return { success: true, antennas };
    } catch (error) {
      return {
        success: false,
        error: "INTERNAL_ERROR",
        details: error.message
      };
    }
  }
}

export default new AntennaService();
