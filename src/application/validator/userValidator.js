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
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
      
      body('uuid')
        .isUUID()
        .withMessage('El UUID del dispositivo debe tener formato válido')
        .notEmpty()
        .withMessage('El UUID del dispositivo es requerido')
        
    ];
  }
    
    userLogginValidator() {
        return [
            body('usr_name').isString().withMessage('El nombre de usuario debe ser una cadena de texto'),
            body('usr_passwd').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        ];
    }


    handleValidationErrors(req, res, next) {
        const errors = validationResult(req);  
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
}
export default new UserValidator();