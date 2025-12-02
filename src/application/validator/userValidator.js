import { body, query, validationResult } from 'express-validator';


class UserValidator {
    
     userLogginValidator() {
    return [
      body('usr_name')
        .isString()
        .withMessage('El nombre de usuario debe ser una cadena de texto')
        .notEmpty()
        .withMessage('El nombre de usuario es requerido'),
      
      body('usr_passwd')
        .isLength({ min: 5 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
      
      body('devUuid')
        .isUUID()
        .withMessage('El UUID del dispositivo debe tener formato válido')
        .notEmpty()
        .withMessage('El UUID del dispositivo es requerido')
        
    ];
  }
    
    handleValidationErrors(req, res, next) {
        const errors = validationResult(req);  
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
    
createUserValidator() {
    return [
      body("usr_name")
        .isString()
        .notEmpty()
        .withMessage("El nombre de usuario es obligatorio"),

      body("usr_passwd")
        .isString()
        .isLength({ min: 5 })
        .withMessage("La contraseña debe tener al menos 5 caracteres"),

      body("usr_last_name")
        .isString()
        .notEmpty()
        .withMessage("El apellido es obligatorio"),

      body("usr_first_name")
        .isString()
        .notEmpty()
        .withMessage("El nombre es obligatorio"),
    ];
  }
}
export default new UserValidator();