import {Router } from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import UserController from '../controllers/userController.js';
import UserValidator from '../validator/userValidator.js';
import handleValidationErrors from '../middlewares/handleValidationErrors.js';

const router = Router();

router.post(
  '/login',
  UserValidator.userLogginValidator(),
  handleValidationErrors,
  (req, res) => UserController.userLoginController(req, res)
);

export default router;

