import sessionRepository from '../../domain/repositories/sessionRepository.js';
import SessionSummaryDTO from '../../domain/dto/SessionSummaryDTO.js';
import fiscalConfigRepository from "../../domain/repositories/fiscalConfigRepository.js";
import deviceRepository from "../../domain/repositories/deviceRepository.js";
import sessionRepository from "../../domain/repositories/sessionRepository.js";

class SessionService {
 async closeSession(sesId) {
    const result = await sessionRepository.closeSession(sesId);

    if (result[0] === 0) {
      throw new Error('Sesión no encontrada');
    }

    //obtener la sesión para identificar el nombre del cajero
    const session = await sessionRepository.findById(sesId);

    // 🔹 Ejecuta la query
    const sessionSummaryRaw = await sessionRepository.getSessionSummary(sesId);

    //obtener la configuración fiscal del dispositivo
    const fiscalConfig = await fiscalConfigRepository.findById(session.fisId);

    //obtener el device para saber el nombre
    const device = await deviceRepository.findById(fiscalConfig.devId);

    // Convierte los resultados en DTOs
    const sessionSummaryDTOs = SessionSummaryDTO.fromQueryResults(sessionSummaryRaw);

    // 5. Generar timestamps
    const now = new Date();

    // Restar 5 horas (UTC-5)
    const utcMinus5 = new Date(now.getTime() - 5 * 60 * 60 * 1000);

    // Timestamp (YYYY-MM-DD HH:mm:ss)
    const timestamp = utcMinus5.toISOString().slice(0, 19).replace("T", " ");

    let lines = [
      process.env.COMPANY_NAME,
      process.env.COMPANY_NIT,
      process.env.COMPANY_ADDRESS,
      '',
      'Cierre de Caja',
      'Caja '+device.devName,
      'Fecha '+timestamp,
      ''
    ];
    
    let total = 0;
    for(let i in sessionSummaryDTOs){
      let d = sessionSummaryDTOs[i];
      lines[lines.length] = d.item +'-' +d.carpark;
      lines[lines.length] = 'Cant. '+d.quantity+" Valor. $"+d.total;
      total += d.total;
    }
    if(sessionSummaryDTOs.length > 0)
      lines[lines.length] = '';
    lines[lines.length] = 'Recaudo Total $'+total;
    lines[lines.length] = '';
    lines[lines.length] = "Cajero "+session.sesCashierName;
    lines[lines.length] = "Operado por "+process.env.COMPANY_OPERATOR;


    return {
      message: 'Sesión cerrada correctamente',
      summary: {
        lines
      }
    };
  }

  async getSessions() {
    return await sessionRepository.getAllSessions();
  }

}

export default new SessionService();
