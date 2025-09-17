import {Session}from "../models/index.js"
class SessionRepository {
  async createSession(sessionData) {
    return await Session.create(sessionData);
  }

  async findById(sesId) {
    return await Session.findByPk(sesId);
  }

  async findActiveByUser(sesCashierId) {
    return await Session.findOne({
      where: {
        sesCashierId,
        DateUntil: null // Sesión activa (no cerrada)
      }
    });
  }

  async closeSession(sesId) {
    return await Session.update(
      { DateUntil: new Date() },
      { where: { sesId } }
    );
  }
}

export default new SessionRepository();