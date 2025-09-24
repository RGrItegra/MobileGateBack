import cron from "node-cron";
import sessionRepository from "../domain/repositories/sessionRepository.js";

// Job que corre cada 10 minutos
cron.schedule("*/1 * * * *", async () => {
  console.log(" Revisando sesiones expiradas...");

  try {
    const sessions = await sessionRepository.findActiveSessions();

    const now = new Date();

    for (const session of sessions) {
      const expireDate = new Date(session.DateFrom);
      expireDate.setHours(expireDate.getHours() + 8);

      if (now > expireDate) {
        console.log(` Cerrando sesión ${session.sesId} por expiración`);
        await sessionRepository.closeSession(session.sesId);
      }
    }
  } catch (error) {
    console.error(" Error en job de expiración de sesiones:", error);
  }
});
