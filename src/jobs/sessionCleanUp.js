import cron from "node-cron";
import sessionRepository from "../domain/repositories/sessionRepository.js";
import deviceRepository from "../domain/repositories/deviceRepository.js";

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

cron.schedule("*/15 * * * *", async () => {
  console.log(" Job: Revisando sesiones inactivas...");

  try {
    const sessions = await sessionRepository.findActiveSessions();
    const now = Date.now();
    const INACTIVITY_LIMIT = 1000 * 60 * 60 * 8; // 8 horas

    for (const ses of sessions) {
      // 1️⃣ validar dispositivo del cual proviene la sesión
      const device = await deviceRepository.findById(ses.devId);

      if (!device) {
        console.log(`Sesión ${ses.sesId} ignorada: Device ${ses.devId} no existe.`);
        continue;
      }

      if (!device.devUuid) {
        console.log(
          ` Sesión ${ses.sesId} ignorada: Device ${ses.devId} no tiene devUuid configurado.`
        );
        continue;
      }

      // determinar última actividad
      const lastActivity = ses.lastActivity
        ? new Date(ses.lastActivity).getTime()
        : new Date(ses.DateFrom).getTime();

      const inactiveTime = now - lastActivity;

      if (inactiveTime < INACTIVITY_LIMIT) {
        // aún activo
        continue;
      }

      // 3️cerrar sesión
      //console.log(`🔴 Cerrando sesión ${ses.sesId} por inactividad...`);

      try {
        const response = await fetch(
          `http://${HOST}:${PORT}/session/sessions/${ses.sesId}/close`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.ok) {
          console.log(`✔️ Sesión ${ses.sesId} cerrada correctamente.`);
        } else {
          console.log(`❌ Error cerrando sesión ${ses.sesId}: ${response.status}`);
        }
      } catch (err) {
        console.error(`❌ Error en petición para cerrar sesión ${ses.sesId}:`, err.message);
      }
    }
  } catch (error) {
    console.error("❌ Error en job de expiración de sesiones:", error);
  }
});
