import sessionRepository from '../../domain/repositories/sessionRepository.js';
import SessionSummaryDTO from '../../domain/dto/SessionSummaryDTO.js';
class SessionService {
 async closeSession(sesId) {
    const result = await sessionRepository.closeSession(sesId);

    if (result[0] === 0) {
      throw new Error('Sesión no encontrada');
    }

    // 🔹 Ejecuta la query
    const sessionSummaryRaw = await sessionRepository.getSessionSummary(sesId);

    // Convierte los resultados en DTOs
    const sessionSummaryDTOs = SessionSummaryDTO.fromQueryResults(sessionSummaryRaw);

    return {
      message: 'Sesión cerrada correctamente',
      summary: sessionSummaryDTOs
    };
  }

  async getSessions() {
    return await sessionRepository.getAllSessions();
  }

}

export default new SessionService();
