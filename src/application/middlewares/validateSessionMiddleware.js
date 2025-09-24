import jwt from "jsonwebtoken";
import sessionRepository from "../../domain/repositories/sessionRepository.js";

export async function validateSessionMiddleware(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ message: "Token requerido" });
    }

    // Decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar la sesión en la BD
    const session = await sessionRepository.findById(decoded.sesId);

    if (!session) {
      return res.status(401).json({ message: "Sesión no encontrada" });
    }

    if (session.DateUntil !== null) {
      return res.status(401).json({ message: "Sesión expirada o cerrada" });
    }

    // Guardar info en req para usar en el controller
    req.user = decoded;
    req.session = session;

    next();

  } catch (error) {
    console.error("Error en validateSessionMiddleware:", error);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}