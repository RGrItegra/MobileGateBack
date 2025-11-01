import sessionService from '../services/sessionServices.js';

class SessionController {

      static async getSessionsController(req, res) {
    try {
      const sessions = await sessionService.getSessions();
      res.status(200).json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener sesiones" });
    }
  }
  static async closeSessionController(req, res) {
  const { sesId } = req.params;
  try {
    const result = await sessionService.closeSession(sesId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al cerrar sesión' });
  }
}

}

export default SessionController;