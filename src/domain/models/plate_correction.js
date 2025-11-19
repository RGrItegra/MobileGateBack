import { DataTypes } from "sequelize";
import sequelize from '../../infraestructure/database/connectionSQLServer.js';

/**
 * Modelo Sequelize para la tabla 'plate_correction'.
 *
 * Esta tabla almacena correcciones de placas asociadas a una gerencia.
 * Cada registro indica una placa corregida y la fecha de corrección.
 *
 * Estructura de la tabla en SQL Server:
 * - cor_id            (int, PK, Identity, NOT NULL)
 * - gerId             (smallint, NOT NULL)
 * - cor_date          (datetime, NOT NULL)
 * - cor_plate         (varchar(10), NOT NULL)
 * - cor_using_date    (datetime, NULL)
 *
 * Restricciones:
 * - PK: cor_id (PRIMARY KEY, auto-increment)
 * - Unique: (gerId, cor_date)
 * - Sin claves foráneas
 */

/**
 * Definición del modelo PlateCorrection.
 *
 * @constant
 * @type {Model}
 */
const PlateCorrection = sequelize.define(
  "PlateCorrection", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único de la corrección.
     * - int en SQL Server
     * - Identity (auto-increment)
     * - Clave primaria (PK)
     * - NOT NULL
     */
    cor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Identificador de la gerencia.
     * - smallint en SQL Server
     * - NOT NULL
     */
    gerId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    /**
     * Fecha de la corrección de la placa.
     * - datetime en SQL Server
     * - NOT NULL
     */
    cor_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * Placa corregida.
     * - varchar(10) en SQL Server
     * - NOT NULL
     */
    cor_plate: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },

    /**
     * Fecha en la que esta corrección fue usada.
     * - datetime en SQL Server
     * - NULL permitido
     */
    cor_using_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "plate_correction", // Nombre exacto de la tabla
    schema: "dbo",
    timestamps: false, // No existen createdAt / updatedAt

    indexes: [
      {
        name: "PK_plate_correction_1",
        unique: true,
        fields: ["cor_id"],
      },
      {
        name: "uk_plate_correction",
        unique: true,
        fields: ["gerId", "cor_date"], // Unique compuesto encontrado en SQL Server
      },
    ],
  }
);

export default PlateCorrection;
