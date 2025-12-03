// src/workers/sessionCleanUp.js
/*
import cron from "node-cron";
import sessionRepository from "../domain/repositories/sessionRepository.js";

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
*/
//cron.schedule("*/2 * * * *", async () => {
  //console.log("⏳ Job: Revisando sesiones inactivas...");

  //try {cron.schedule("*/15 * * * * *", async () => {
  //  console.log("⏳ Revisando sesiones inactivas...");

/*try {
        const sessions = await sessionRepository.findActiveSessionsWithDevice();

        for (const { session } of sessions) {
            const lastActivity = new Date(session.lastActivity);
            const diffMinutes = (Date.now() - lastActivity.getTime()) / 60000;

            if (diffMinutes > 15) {
                await sessionRepository.closeSession(session.id);
                console.log(` Sesión ${session.id} cerrada por inactividad`);
            }
        }

    } catch (err) {
        console.error("Error en job de expiración de sesiones:", err);
    }
});
    const sessions = await sessionRepository.findActiveSessionsWithDevice();

    const now = Date.now();
    const INACTIVITY_LIMIT = 1000 * 60 * 2; // 2 minutos

    for (const ses of sessions) {
      // Extraer device desde las asociaciones
      const firstTransaction = ses.transactions?.[0];
      const device = firstTransaction?.fiscalConfig?.device;

      if (!device) {
        console.log(
          `⚠️ Sesión ${ses.sesId} ignorada: No se encontró dispositivo asociado.`
        );
        continue;
      }

      if (!device.devUuid) {
        console.log(
          `⚠️ Sesión ${ses.sesId} ignorada: Device ${device.devId} no tiene devUuid.`
        );
        continue;
      }

      // Determinar última actividad
      const lastActivity = ses.lastActivity
        ? new Date(ses.lastActivity).getTime()
        : new Date(ses.DateFrom).getTime();

      const inactiveTime = now - lastActivity;

      if (inactiveTime < INACTIVITY_LIMIT) {
        continue; // Aún activa
      }

      console.log(`🔴 Cerrando sesión ${ses.sesId} por inactividad...`);

      try {
        const response = await fetch(
          `http://${HOST}:${PORT}/session/sessions/${ses.sesId}/close`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
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

*/