import jwt from "jsonwebtoken";
import userServices from "../services/userServices.js";

class UserController {

  async userLoginController(req, res) {
    //console.log(" Body recibido en login:", req.body); 
    try {
      const { usr_name, usr_passwd, devUuid } = req.body;

      // Validar que se envíe el UUID
      if (!devUuid) {
        return res.status(400).json({ 
          message: "UUID del dispositivo es requerido" 
        });
      }

      //  CORREGIDO: Pasar devUuid al servicio
      const result = await userServices.completeLogin(usr_name, usr_passwd, devUuid);

      if (!result.success) {
        const errorMessages = {
          USER_NOT_FOUND: { status: 404, message: "Usuario no encontrado" },
          WRONG_PASSWORD: { status: 401, message: "Contraseña incorrecta" },
          DEVICE_NOT_FOUND: { status: 404, message: "Dispositivo no encontrado o deshabilitado" },
          FISCAL_CONFIG_NOT_FOUND: { status: 404, message: "No hay configuración fiscal para este dispositivo" },
          INTERNAL_ERROR: { status: 500, message: "Error interno del servidor" }
        };

        const errorInfo = errorMessages[result.error] || 
          { status: 500, message: "Error desconocido" };

        return res.status(errorInfo.status).json({
          message: errorInfo.message,
          error: result.error,
          details: result.details
        });
      }

      // Generar token JWT con el sesId
      const token = jwt.sign(
        { 
          sesId: result.data.session.sesId,
          usr_id: result.data.user.usr_id,
          usr_name: result.data.user.usr_name,
          devId: result.data.device.devId,
          fisId: result.data.fiscalConfig.fisId
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || "8h" }
      );

      res.status(200).json({
        message: "Login exitoso",
        token,
        session: {
          sesId: result.data.session.sesId,
          cashierName: result.data.session.sesCashierName,
          shiftId: result.data.session.sesShiftId,
          dateFrom: result.data.session.DateFrom
        },
        device: {
          devId: result.data.device.devId,
          devName: result.data.device.devName,
          devPath: result.data.device.devPath
        },
        fiscalConfig: {
          fisId: result.data.fiscalConfig.fisId,
          currentInvoice: result.data.fiscalConfig.fisCurrentInvoice,
          invoiceRange: {
            from: result.data.fiscalConfig.fisInvoiceFrom,
            until: result.data.fiscalConfig.fisInvoiceUntil
          }
        }
      });

    } catch (err) {
      console.error(" Error en login:", err);
      res.status(500).json({ 
        message: "Error en el login", 
        error: err.message 
      });
    }
  }

//R E G I S T E R / C O N T R O L L E R

   async createUserController(req, res) {
    try {
      const { usr_name, usr_passwd, usr_last_name, usr_first_name } = req.body;

      const result = await userServices.createUserService(
        usr_name,
        usr_passwd,
        usr_last_name,
        usr_first_name
      );

      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(201).json({
        message: "Usuario registrado correctamente",
        user: result.user,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  }
}

export default new UserController();
