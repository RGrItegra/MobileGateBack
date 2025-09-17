import jwt from "jsonwebtoken";
import sessionRepository from "../../domain/repositories/sessionRepository.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que la sesión aún esté activa
    const session = await sessionRepository.findById(decoded.sesId);
    if (!session || session.DateUntil) {
      return res.status(401).json({ 
        message: "Sesión expirada o inválida" 
      });
    }

    req.user = decoded;
    req.session = session;
    next();
    
  } catch (err) {
    return res.status(403).json({ 
      message: "Token inválido o expirado" 
    });
  }
}

// Middleware adicional para verificar permisos específicos del dispositivo
export async function deviceAuthMiddleware(req, res, next) {
  try {
    const { devId } = req.params;
    
    if (req.user.devId !== parseInt(devId)) {
      return res.status(403).json({
        message: "No tienes permisos para acceder a este dispositivo"
      });
    }
    
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Error verificando permisos del dispositivo"
    });
  }
}

















/*
export function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ahora puedes acceder al usuario en las rutas
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}
*/