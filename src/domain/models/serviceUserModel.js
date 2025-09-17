import { DataTypes } from "sequelize";
import sequelize from '../../infraestructure/database/connectionSQLServer.js';

/**
 * Modelo Sequelize para la tabla 'service_user'.
 * 
 * Esta tabla almacena la información de usuarios del sistema de servicios.
 * 
 * Estructura de la tabla en SQL Server:
 * - usuId        (int, PK, Identity, NOT NULL)
 * - usuTipoDcto  (tinyint, NOT NULL)
 * - usuNroDcto   (varchar(15), NOT NULL, parte de UNIQUE con usuTipoDcto)
 * - usuName      (varchar(50), NOT NULL)
 * - usuEmail     (varchar(150), NOT NULL)
 * - usuLastName  (varchar(50), NULL)
 * - usuBillName  (varchar(150), NULL)
 * 
 * Restricciones:
 * - PK: usuId
 * - UNIQUE: (usuTipoDcto, usuNroDcto)
 * - FK: Referenciado por ParkingInput (FK_ParkingInput_service_user)
 */
/**
 * Definición del modelo ServiceUser.
 * 
 * @constant
 * @type {Model}
 */
const ServiceUser = sequelize.define(
  "ServiceUser", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único del usuario.
     * - int en SQL Server
     * - Clave primaria (PK)
     * - Identity (auto-increment)
     * - NOT NULL
     */
    usuId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true, // Identity en SQL Server
    },

    /**
     * Tipo de documento del usuario.
     * - tinyint en SQL Server
     * - NOT NULL
     */
    usuTipoDcto: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },

    /**
     * Número del documento del usuario.
     * - varchar(15) en SQL Server
     * - NOT NULL
     * - Forma parte de la clave única con usuTipoDcto
     */
    usuNroDcto: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },

    /**
     * Nombre del usuario.
     * - varchar(50) en SQL Server
     * - NOT NULL
     */
    usuName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /**
     * Correo electrónico del usuario.
     * - varchar(150) en SQL Server
     * - NOT NULL
     */
    usuEmail: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    /**
     * Apellido del usuario.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    usuLastName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Nombre de facturación del usuario.
     * - varchar(150) en SQL Server
     * - NULL permitido
     */
    usuBillName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
  },
  {
    tableName: "service_user", // Nombre exacto de la tabla en SQL Server
    schema: "dbo",             // Esquema donde está la tabla
    timestamps: false,         // No hay columnas createdAt / updatedAt
    indexes: [
      {
        name: "PK_service_user", // Índice de la clave primaria
        unique: true,
        fields: ["usuId"],
      },
      {
        name: "uq_service_user_document", // Índice único para documento
        unique: true,
        fields: ["usuTipoDcto", "usuNroDcto"],
      },
    ],
  }
);

export default ServiceUser;
