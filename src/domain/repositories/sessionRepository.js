import { Session } from "../models/index.js";
import { TransactionData } from "../models/index.js";
import { FiscalConfig } from "../models/index.js";
import { Device } from "../models/index.js";
import { Op, literal, QueryTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";

class SessionRepository {

  async getAllSessions() {
    try {
      return await Session.findAll({
        order: [["DateFrom", "DESC"]],
      });
    } catch (error) {
      console.error("Error al obtener sesiones:", error);
      throw error;
    }
  }

  async findActiveByUser(userId) {
    return await Session.findOne({
      where: {
        sesCashierId: userId,
        DateUntil: null,
      },
    });
  }

  async closeSession(sesId) {
    try {
      console.log(`Cerrando sesión ${sesId}`);

      return await Session.update(
        { DateUntil: literal("SYSDATETIMEOFFSET()") },
        { where: { sesId } }
      );
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      console.log("Creando sesión con datos:", sessionData);

      const session = await Session.create({
        fisId: sessionData.fisId,
        sesCashierName: sessionData.sesCashierName,
        sesCashierId: sessionData.sesCashierId,
        sesShiftId: sessionData.sesShiftId,
        InvoiceFrom: sessionData.InvoiceFrom,
        InvoiceUntil: sessionData.InvoiceUntil,
        sessName: sessionData.sessName,
      });

      return session;
    } catch (error) {
      console.error(" Error al crear sesión en BD:", error);
      throw error;
    }
  }

  async findById(sesId) {
    return await Session.findByPk(sesId);
  }

  async findActiveSessions() {
    return await Session.findAll({
      where: { DateUntil: null },
    });
  }

  async updateSessionToken(sesId, token) {
    try {
      return await Session.update(
        { sesToken: token },
        { where: { sesId } }
      );
    } catch (error) {
      console.error("Error al actualizar token de sesión:", error);
      throw error;
    }
  }

  async getSessionSummary(sesId) {
    try {
      const results = await sequelize.query(
        `
        SELECT 
          i.iteName AS item,
          pp.iteEntryAreaName AS carpark,
          COUNT(*) AS quantity,
          SUM(i.iteTotalPrice) AS total
        FROM TransactionData t
        INNER JOIN Item i ON i.traId = t.traId
        LEFT JOIN ParkingItem pp ON pp.iteId = i.iteId
        WHERE t.sesId = :sesId
        GROUP BY i.iteName, pp.iteEntryAreaName;
        `,
        {
          replacements: { sesId },
          type: QueryTypes.SELECT,
        }
      );

      return results;
    } catch (error) {
      console.error("Error al obtener resumen de sesión:", error);
      throw error;
    }
  }

  /**
   * 🔥 Obtiene sesiones activas donde exista device REAL asociado
   */
 async findActiveSessionsWithDevice() {
  try {
    const sessions = await this.findActiveSessions(); // Session con DateUntil = null
    const results = [];

    for (const ses of sessions) {

      // 1. FiscalConfig
      const fiscal = await FiscalConfig.findOne({
        where: { fisId: ses.fisId }
      });

      if (!fiscal) {
        console.warn(`⚠️ Sesión ${ses.sesId} ignorada: No existe FiscalConfig para fisId=${ses.fisId}`);
        continue;
      }

      // 2. Device
      const device = await Device.findOne({
        where: { devId: fiscal.devId }
      });

      if (!device) {
        console.warn(`⚠️ Sesión ${ses.sesId} ignorada: No existe Device con devId=${fiscal.devId}`);
        continue;
      }

      // 3. Validar UUID
      if (!device.devUuid) {
        console.warn(`⚠️ Sesión ${ses.sesId} ignorada: Device devId=${device.devId} tiene devUuid NULL`);
        continue;
      }

      // 4. OK
      results.push({
        session: ses,
        device,
        fiscalConfig: fiscal
      });
    }

    return results;

  } catch (error) {
    console.error("❌ Error en findActiveSessionsWithDevice:", error);
    throw error;
  }
}

}

export default new SessionRepository();
