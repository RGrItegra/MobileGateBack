import cron from "node-cron";
import sessionRepository from "../domain/repositories/sessionRepository.js";


cron.schedule("0 */8 * * *", async () => {
  console.log("Revisando sesiones expiradas...");

  try {
    const sessions = await sessionRepository.findActiveSessions();
    const now = new Date();

    for (const session of sessions) {
      const expireDate = new Date(session.DateFrom);
      expireDate.setHours(expireDate.getHours() + 8); 

      if (now > expireDate) {
        console.log(` Cerrando sesión ${session.sesId} por expiración`);

        try {
          const response = await fetch(`http://localhost:3000/session/sessions/${session.sesId}/close`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            console.log(` Sesión ${session.sesId} cerrada correctamente`);
          } else {
            console.log(` Error al cerrar sesión ${session.sesId}:`, response.status);
          }
        } catch (fetchError) {
          console.error(` Error en petición para cerrar sesión ${session.sesId}:`, fetchError.message);
        }
      }
    }
  } catch (error) {
    console.error(" Error en job de expiración de sesiones:", error);
  }
});
