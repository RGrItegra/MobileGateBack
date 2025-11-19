import { body } from "express-validator";

export const plateCorrectionValidator = [
  body("gerId")
    .isInt().withMessage("gerId debe ser un número entero.")
    .notEmpty().withMessage("gerId es obligatorio."),

  body("cor_plate")
    .isString().withMessage("cor_plate debe ser texto.")
    .isLength({ min: 1, max: 10 }).withMessage("cor_plate debe tener máximo 10 caracteres.")
    .notEmpty().withMessage("cor_plate es obligatorio."),
];
