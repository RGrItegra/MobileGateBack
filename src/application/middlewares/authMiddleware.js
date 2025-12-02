export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const session = await sessionRepository.findById(decoded.sesId);

    if (!session || session.DateUntil !== null) {
      return res.status(401).json({ message: "Sesión expirada o inválida" });
    }

    // Registrar actividad
    await sessionRepository.updateLastActivity(decoded.sesId);

    req.user = decoded;
    req.session = session;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}
