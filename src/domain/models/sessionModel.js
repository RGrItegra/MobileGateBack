import sequelize from '../../infraestructure/database/connectionSQLServer.js';
import { DataTypes, Sequelize } from "sequelize";

/**
 * Modelo Sequelize para la tabla 'Session'.
 * 
 * Esta tabla almacena la información de las sesiones de caja/turno.
 * 
 * Restricciones:
 * - PK: sesId
 * - FK: Referenciada por TransactionData (FK_TransactionData_Session)
 */
/**
 * Definición del modelo Session.
 * 
 * @constant
 * @type {Model}
 */
const Session = sequelize.define(
  "Session",
  {
    sesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true, // Identity
    },
    fisId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sesCashierName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sesCashierId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sesShiftId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    InvoiceFrom: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    InvoiceUntil: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    DateFrom: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: Sequelize.fn("GETDATE"),
    },
    DateUntil: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sessName: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "Session",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_Session",
        unique: true,
        fields: ["sesId"],
      },
    ],
  }
);

export default Session;
