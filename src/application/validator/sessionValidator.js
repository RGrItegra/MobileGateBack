import { param } from 'express-validator';

class SessionValidator {
  static closeSessionValidator() {
    return [
      param('sesId')
        .exists().withMessage('El sesId es obligatorio')
    ]
  }
}

export default SessionValidator;
