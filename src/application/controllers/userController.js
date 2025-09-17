import jwt from "jsonwebtoken";
import userServices from "../services/userServices.js";

class UserController {

  async userLoginController(req, res) {
    try {
      const { usr_name, usr_passwd, uuid} = req.body;

      // Validar que se envíe el UUID
      if (!uuid) {
        return res.status(400).json({ 
          message: "UUID del dispositivo es requerido" 
        });
      }

      const result = await userServices.completeLogin(usr_name, usr_passwd);

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
      res.status(500).json({ 
        message: "Error en el login", 
        error: err.message 
      });
    }
  }
}


export default new UserController();
























/*class UserController {
    async postNewUserController(req, res) {
        try {
            const newUser = await userServices.postNewUserRepository(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).json({ message: 'Error al crear usuario', error: err.message });
        }
    }

     async userLoginController(req, res) {
    try {
      const { usr_name, usr_passwd } = req.body;

      const result = await userServices.userLogin(usr_name, usr_passwd);

      if (result === null) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (result === "wrong_password") {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
     

      // Generar token
      const token = jwt.sign(
        { id: result.id, usr_name: result.usr_name }, // payload mínimo
        process.env.JWT_SECRET,                      // clave secreta
        { expiresIn: process.env.JWT_EXPIRES || "2h" } // duración del token
      );

      res.status(200).json({
        message: "Login exitoso",
        token,
      });
    } catch (err) {
      res.status(500).json({ message: "Error en el login", error: err.message });
    }
  }

};
export default new UserController();
*/