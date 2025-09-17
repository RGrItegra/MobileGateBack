import { validationResult } from 'express-validator';

/**
 * Middleware que maneja errores de validación generados por express-validator.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Errores de validación",
      errors: errors.array()
    });
  }
  next();
};

export default handleValidationErrors;