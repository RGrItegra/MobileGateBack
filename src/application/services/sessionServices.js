import sessionRepository from '../../domain/repositories/sessionRepository.js';

class SessionService {
  async closeSession(sesId) {
    const result = await sessionRepository.closeSession(sesId);

    if (result[0] === 0) {
      // No se encontró la sesión
      throw new Error('Sesión no encontrada');
    }

    return result;
  }

   async getSessions() {
    return await sessionRepository.getAllSessions();
  }
}

export default new SessionService();
