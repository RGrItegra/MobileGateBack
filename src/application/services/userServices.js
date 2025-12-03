// userServices.js
import bcrypt from 'bcrypt';
import userRepository from "../../domain/repositories/userRepository.js";
import deviceRepository from '../../domain/repositories/deviceRepository.js';
import fiscalConfigRepository from '../../domain/repositories/fiscalConfigRepository.js';
import sessionRepository from '../../domain/repositories/sessionRepository.js';
import jwt from "jsonwebtoken";
import {sessionModel} from '../../domain/models/index.js'
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
async updateToken(sesId, token) {
  return await sessionRepository.updateSessionToken(sesId, token);
}
 createSqlServerDate() {
    const now = new Date();
    // Crear fecha en formato ISO que SQL Server entienda
    return now.toISOString().slice(0, 23) + '+00:00';
  }

  async createUserSession(user, fiscalConfig,device) {
    try {
      /*
      // Cerrar sesión activa si existe
      const activeSession = await sessionRepository.findActiveByUser(user.usr_id.toString());
      if (activeSession) {
        await sessionRepository.closeSession(activeSession.sesId);
      }
*/
      //  CORREGIDO: Usar formato de fecha compatible con SQL Server
      const currentDate = this.createSqlServerDate();
      
      const sessionData = {
        fisId: fiscalConfig.fisId,
        sesCashierName: `${user.usr_first_name} ${user.usr_last_name}`,
        sesCashierId: user.usr_id.toString(),
        devName: device.devName,
        sesShiftId: `${Date.now()}`,
        InvoiceFrom: fiscalConfig.fisCurrentInvoice != null
          ? Number(fiscalConfig.fisCurrentInvoice)
          : (fiscalConfig.fisInvoiceFrom != null ? Number(fiscalConfig.fisInvoiceFrom) : 0),
        InvoiceUntil: fiscalConfig.fisInvoiceUntil != null
          ? Number(fiscalConfig.fisInvoiceUntil)
          : 0,
        DateFrom: currentDate, 
        DateUntil: null,
        sessName: `${Date.now()}` 
      };

      //console.log(" Datos de sesión a crear:", sessionData);
      
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
      deviceResult.device
    );
    if (!sessionResult.success) return sessionResult;

    const session = sessionResult.session;
    const sesId = session.sesId; //  asegurarte que tu modelo devuelve este campo

    // Generar token con sesId incluido
   const token = jwt.sign(
      {
        usrId: userResult.user.usr_id, //  igual que en la BD
        devId: deviceResult.device.devId,
        sesId: sesId
      },
      process.env.JWT_SECRET,
   { expiresIn: process.env.JWT_EXPIRES } 
  );

    // Guardar el token en la sesión
  await this.updateToken(sesId, token);

  return {
    success: true,
    data: {
      user: userResult.user,
      device: deviceResult.device,
      fiscalConfig: fiscalResult.fiscalConfig,
      session: { ...session.toJSON(), sesToken: token }, // devolvemos la sesión con token
      token
    }
  };

  } catch (error) {
    console.error("Error en completeLogin:", error);
    return { success: false, error: "INTERNAL_ERROR", details: error.message };
  }
}
//R E G I S T R A R  U S U A R I O

async createUserService(usr_name, usr_passwd, usr_last_name, usr_first_name) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await userRepository.findByUsername(usr_name);
      if (existingUser) {
        return { success: false, message: "El usuario ya existe" };
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(usr_passwd, 10);

      // Crear usuario
      const newUser = await userRepository.createUserRepository({
        usr_name,
        usr_passwd: hashedPassword,
        usr_last_name,
        usr_first_name,
      });

      // Excluir la contraseña del objeto de retorno
      const { usr_passwd: _, ...userWithoutPassword } = newUser.dataValues;

      return { success: true, user: userWithoutPassword };
    } catch (error) {
      console.error("Error en createUserService:", error);
      return { success: false, message: "Error al registrar el usuario" };
    }
  }
}

export default new UserServices();
