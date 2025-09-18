import { Session } from "../models/index.js";
import { Op, literal } from "sequelize";

class SessionRepository {

  async findActiveByUser(userId) {
    return await Session.findOne({
      where: {
        sesCashierId: userId,
        
        DateUntil: null // Sesión activa
      }
    });
  }

  async closeSession(sesId) {
    try {
      console.log(`🔒 Cerrando sesión ${sesId}`);
      
      // ✅ Usar función de SQL Server para cerrar con fecha actual
      return await Session.update(
        { 
        
          DateUntil: literal('SYSDATETIMEOFFSET()')
        },
        { where: { sesId } }
      );
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      throw error;
    }
  }

  async createSession(sessionData) {
    try {
      console.log("📝 Creando sesión con datos:", sessionData);
      
      // ✅ SIMPLIFICADO: DateFrom se maneja automáticamente por el modelo
      const session = await Session.create({
        fisId: sessionData.fisId,
        sesCashierName: sessionData.sesCashierName,
        sesCashierId: sessionData.sesCashierId,
        sesShiftId: sessionData.sesShiftId,
        InvoiceFrom: sessionData.InvoiceFrom,
        InvoiceUntil: sessionData.InvoiceUntil,
        sessName: sessionData.sessName
        // ✅ DateFrom y DateUntil se manejan automáticamente
      });
      
      return session;
    } catch (error) {
      console.error("❌ Error al crear sesión en BD:", error);
      throw error;
    }
  }

  async findById(sesId) {
    return await Session.findByPk(sesId);
  }
}

export default new SessionRepository();