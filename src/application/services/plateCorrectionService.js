import plateCorrectionRepository from "../../domain/repositories/plateCorrectionRepository";
import { PlateCorrection } from "../../domain/models/index";

class PlateCorrectionService {
  async createCorrection(gerId, cor_plate) {
    try {
      // Obtener fecha y hora en Colombia (UTC-5)
      const now = new Date();
      // Ajustar a UTC-5
      const colombiaOffset = -5 * 60; // minutos
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const colombiaTime = new Date(utc + colombiaOffset * 60000);

      // Formatear como YYYY-MM-DD HH:MM:SS para SQL Server
      const cor_date = `${colombiaTime.getFullYear()}-${String(colombiaTime.getMonth()+1).padStart(2,'0')}-${String(colombiaTime.getDate()).padStart(2,'0')} ${String(colombiaTime.getHours()).padStart(2,'0')}:${String(colombiaTime.getMinutes()).padStart(2,'0')}:${String(colombiaTime.getSeconds()).padStart(2,'0')}`;

      const newCorrection = await PlateCorrection.create({
        gerId,
        cor_date,
        cor_plate,
        cor_using_date: null
      });

      return { success: true, data: newCorrection };

    } catch (error) {
      return { success: false, error };
    }
  }
}

export default new PlateCorrectionService();
