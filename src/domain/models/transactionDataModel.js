
import { DataTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";
/**
 * Modelo Sequelize para la tabla 'TransactionData'.
 * 
 * Esta tabla almacena la información de transacciones realizadas, incluyendo referencias
 * a clientes, sesiones, configuraciones fiscales y otros datos asociados.
 * 
 * Estructura de la tabla en SQL Server:
 * - traId             (int, PK, Identity, NOT NULL)
 * - traReferenceId    (varchar(50), NULL)
 * - traIsDuplicate    (bit, NULL)
 * - traTimestamp      (datetime, NULL)
 * - traInvoiceNumber  (varchar(50), NULL)
 * - cusId             (int, FK a Customer, NULL)
 * - traNIT            (varchar(20), NULL)
 * - traFiscalName     (varchar(100), NULL)
 * - traTelephone      (varchar(30), NULL)
 * - traAddress        (varchar(200), NULL)
 * - traOperator       (varchar(200), NULL)
 * - traNroFactura     (bigint, NULL)
 * - fisId             (int, FK a FiscalConfig, NULL)
 * - sesId             (int, FK a Session, NOT NULL)
 * - traIsTransmited   (bit, NOT NULL, DEFAULT 0)
 * - traCanceled       (bit, NULL)
 * - traSaveTime       (datetime, NOT NULL, DEFAULT getdate())
 * - traCufe           (varchar(200), NULL)
 * - traAtteDate       (datetime, NULL)
 * - traExternalPdf    (varchar(400), NULL)
 * 
 * Restricciones:
 * - PK: traId
 * - FK: cusId → Customer
 * - FK: fisId → FiscalConfig
 * - FK: sesId → Session
 */
const TransactionData = sequelize.define(
  "TransactionData",
  {
    traId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    traReferenceId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    traIsDuplicate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    traTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    traInvoiceNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    traNIT: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    traFiscalName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    traTelephone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    traAddress: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    traOperator: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    traNroFactura: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    fisId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    traIsTransmited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    traCanceled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    traSaveTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    traCufe: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    traAtteDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    traExternalPdf: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
  },
  {
    tableName: "TransactionData",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_TransactionData",
        unique: true,
        fields: ["traId"],
      },
    ],
  }
);

export default TransactionData;
