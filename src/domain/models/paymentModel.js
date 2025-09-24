import { DataTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";
/**
 * Modelo Sequelize para la tabla 'Payment'.
 *
 * Esta tabla almacena los pagos realizados, incluyendo el monto,
 * el cambio, el tipo de pago, y sus relaciones con transacciones
 * y monedas.
 *
 * Estructura de la tabla en SQL Server:
 * - payId            (int, PK, Identity, NOT NULL)
 * - payAmount        (decimal(12,2), NULL)
 * - payChange        (decimal(12,2), NULL)
 * - currId           (int, FK → CurrencyAmount.currId, NULL)
 * - payName          (varchar(50), NULL)
 * - payDescription   (varchar(50), NULL)
 * - payPaymentType   (int, NULL)
 * - traId            (int, FK → TransactionData.traId, NOT NULL)
 *
 * Restricciones:
 * - PK: payId (PRIMARY KEY, clustered, auto-increment)
 * - FK: currId → CurrencyAmount(currId) (FK_Payment_CurrencyAmount)
 * - FK: traId → TransactionData(traId) (FK_Payment_TransactionData)
 */
/**
 * Definición del modelo Payment.
 *
 * @constant
 * @type {Model}
 */
const Payment = sequelize.define(
  "Payment", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único del pago.
     * - int en SQL Server
     * - Clave primaria (PK)
     * - Identity (auto-increment)
     * - NOT NULL
     */
    payId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Monto del pago.
     * - decimal(12,2) en SQL Server
     * - NULL permitido
     */
    payAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    /**
     * Cambio entregado en el pago.
     * - decimal(12,2) en SQL Server
     * - NULL permitido
     */
    payChange: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    /**
     * Identificador de la moneda utilizada.
     * - int en SQL Server
     * - FK hacia CurrencyAmount(currId)
     * - NULL permitido
     */
    currId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    /**
     * Nombre o referencia del pago.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    payName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Descripción del pago.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    payDescription: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Tipo de pago (ej: efectivo, tarjeta, transferencia).
     * - int en SQL Server
     * - NULL permitido
     */
    payPaymentType: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    /**
     * Identificador de la transacción asociada.
     * - int en SQL Server
     * - FK hacia TransactionData(traId)
     * - NOT NULL
     */
    traId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Payment", // Nombre exacto de la tabla en SQL Server
    schema: "dbo",        // Esquema donde está la tabla
    timestamps: false,    // No hay columnas createdAt / updatedAt
    indexes: [
      {
        name: "PK_Payment", // Índice de la clave primaria
        unique: true,
        fields: ["payId"],
      },
    ],
  }
);

export default Payment;
