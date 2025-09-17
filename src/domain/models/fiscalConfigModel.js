import { DataTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";
/**
 * Modelo Sequelize para la tabla 'FiscalConfig'.
 *
 * Esta tabla almacena la configuración fiscal de facturación,
 * incluyendo resoluciones, rangos de facturas y parámetros
 * asociados a un dispositivo.
 *
 * Estructura de la tabla en SQL Server:
 * - fisId                (int, PK, Identity, NOT NULL)
 * - fisResolutionPre     (varchar(10), NULL)
 * - fisResolutionNumber  (varchar(50), NULL)
 * - fisDateFrom          (date, NULL)
 * - fisDateUntil         (date, NULL)
 * - fisInvoiceFrom       (bigint, NULL)
 * - fisInvoiceUntil      (bigint, NULL)
 * - fisCurrentInvoice    (bigint, NULL)
 * - fisIva               (float, NULL)
 * - fisHeader            (varchar(2000), NULL)
 * - fisInfoPos           (varchar(2000), NULL)
 * - devId                (tinyint, FK → Device.devId, NOT NULL)
 *
 * Restricciones:
 * - PK: fisId
 * - FK: devId → Device(devId) (FK_FiscalConfig_Device)
 * - Referenciada por: TransactionData (FK_TransactionData_FiscalConfig)
 */
/**
 * Definición del modelo FiscalConfig.
 *
 * @constant
 * @type {Model}
 */
const FiscalConfig = sequelize.define(
  "FiscalConfig", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único de la configuración fiscal.
     * - int en SQL Server
     * - Clave primaria (PK)
     * - Identity (auto-increment)
     * - NOT NULL
     */
    fisId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Prefijo de la resolución.
     * - varchar(10) en SQL Server
     * - NULL permitido
     */
    fisResolutionPre: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    /**
     * Número de resolución.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    fisResolutionNumber: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Fecha de inicio de la resolución.
     * - date en SQL Server
     * - NULL permitido
     */
    fisDateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    /**
     * Fecha de finalización de la resolución.
     * - date en SQL Server
     * - NULL permitido
     */
    fisDateUntil: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    /**
     * Rango inicial de facturación.
     * - bigint en SQL Server
     * - NULL permitido
     */
    fisInvoiceFrom: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    /**
     * Rango final de facturación.
     * - bigint en SQL Server
     * - NULL permitido
     */
    fisInvoiceUntil: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    /**
     * Factura actual en uso.
     * - bigint en SQL Server
     * - NULL permitido
     */
    fisCurrentInvoice: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    /**
     * Porcentaje de IVA.
     * - float en SQL Server
     * - NULL permitido
     */
    fisIva: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    /**
     * Encabezado de la factura.
     * - varchar(2000) en SQL Server
     * - NULL permitido
     */
    fisHeader: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },

    /**
     * Información para punto de venta.
     * - varchar(2000) en SQL Server
     * - NULL permitido
     */
    fisInfoPos: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },

    /**
     * Identificador del dispositivo asociado.
     * - tinyint en SQL Server
     * - FK hacia Device(devId)
     * - NOT NULL
     */
    devId: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
  },
  {
    tableName: "FiscalConfig", // Nombre exacto de la tabla en SQL Server
    schema: "dbo",             // Esquema donde está la tabla
    timestamps: false,         // No hay columnas createdAt / updatedAt
    indexes: [
      {
        name: "PK_InvoiceConfig", // Índice de la clave primaria
        unique: true,
        fields: ["fisId"],
      },
    ],
  }
);

export default FiscalConfig;
