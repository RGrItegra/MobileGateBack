// userServices.js
import bcrypt from 'bcrypt';
import userRepository from "../../domain/repositories/userRepository.js";
import deviceRepository from '../../domain/repositories/deviceRepository.js';
import fiscalConfigRepository from '../../domain/repositories/fiscalConfigRepository.js';
import sessionRepository from '../../domain/repositories/sessionRepository.js';

class UserServices {

  async userLogin(usr_name, usr_passwd) {
    const user = await userRepository.userLogin(usr_name);
    if (!user) return { success: false, error: "USER_NOT_FOUND" };

    const isMatch = await bcrypt.compare(usr_passwd, user.usr_passwd);
    if (!isMatch) return { success: false, error: "WRONG_PASSWORD" };

    return { success: true, user };
  }

  async validateDevice(uuid) {
    const device = await deviceRepository.findByUuid(uuid);
    if (!device) return { success: false, error: "DEVICE_NOT_FOUND" };
    return { success: true, device };
  }

  async getFiscalConfig(devId) {
    const fiscalConfig = await fiscalConfigRepository.getLastByDeviceId(devId);
    if (!fiscalConfig) return { success: false, error: "FISCAL_CONFIG_NOT_FOUND" };

    return { success: true, fiscalConfig };
  }

 createSqlServerDate() {
    const now = new Date();
    // Crear fecha en formato ISO que SQL Server entienda
    return now.toISOString().slice(0, 23) + '+00:00';
  }

  async createUserSession(user, fiscalConfig,device) {
    try {
      // Cerrar sesión activa si existe
      const activeSession = await sessionRepository.findActiveByUser(user.usr_id.toString());
      if (activeSession) {
        await sessionRepository.closeSession(activeSession.sesId);
      }

      //  CORREGIDO: Usar formato de fecha compatible con SQL Server
      const currentDate = this.createSqlServerDate();
      
      const sessionData = {
        fisId: fiscalConfig.fisId,
        sesCashierName: `${user.usr_first_name} ${user.usr_last_name}`,
        sesCashierId: user.usr_id.toString(),
        devName: device.devName,
        sesShiftId: `SHIFT_${Date.now()}`,
        InvoiceFrom: fiscalConfig.fisCurrentInvoice != null
          ? Number(fiscalConfig.fisCurrentInvoice)
          : (fiscalConfig.fisInvoiceFrom != null ? Number(fiscalConfig.fisInvoiceFrom) : 0),
        InvoiceUntil: fiscalConfig.fisInvoiceUntil != null
          ? Number(fiscalConfig.fisInvoiceUntil)
          : 0,
        DateFrom: currentDate, //  Formato compatible con SQL Server
        DateUntil: null,
        sessName: `SES_${Date.now()}` //  CORREGIDO: Faltaba comilla
      };

      console.log(" Datos de sesión a crear:", sessionData);
      
      const session = await sessionRepository.createSession(sessionData);
      return { success: true, session };
      
    } catch (error) {
      console.error(" Error al crear sesión:", error);
      return { success: false, error: "SESSION_CREATION_ERROR", details: error.message };
    }
  }

  async completeLogin(usr_name, usr_passwd, devUuid) {
  try {
    const userResult = await this.userLogin(usr_name, usr_passwd);
    if (!userResult.success) return userResult;

    const deviceResult = await this.validateDevice(devUuid);
    if (!deviceResult.success) return deviceResult;

    const fiscalResult = await this.getFiscalConfig(deviceResult.device.devId);
    if (!fiscalResult.success) return fiscalResult;

    const sessionResult = await this.createUserSession(
      userResult.user,
      fiscalResult.fiscalConfig,
      deviceResult.device // ahora sí lo pasamos
    );
    if (!sessionResult.success) return sessionResult;

    return {
      success: true,
      data: {
        user: userResult.user,
        device: deviceResult.device,
        fiscalConfig: fiscalResult.fiscalConfig,
        session: sessionResult.session
      }
    };

  } catch (error) {
    console.error("Error en completeLogin:", error);
    return { success: false, error: "INTERNAL_ERROR", details: error.message };
  }
}

}

export default new UserServices();
