
import { DataTypes } from "sequelize";
import sequelize from '../../infraestructure/database/connectionSQLServer.js';

/**
 * Modelo Sequelize para la tabla 'admParameter'.
 * 
 * Esta tabla almacena parámetros administrativos con un identificador,
 * un nombre y un valor. 
 * 
 * Estructura de la tabla en SQL Server:
 * - parId    (tinyint, PK, NOT NULL)
 * - parName  (varchar(30), NOT NULL)
 * - parValue (varchar(400), NULL)
 */
/**
 * Definición del modelo AdmParameter.
 * 
 * @constant
 * @type {Model}
 */

const AdmParameter = sequelize.define(
  "AdmParameter", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único del parámetro.
     * - tinyint en SQL Server
     * - Clave primaria (PK)
     * - NOT NULL
     */
    parId: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
    },

    /**
     * Nombre del parámetro.
     * - varchar(30) en SQL Server
     * - NOT NULL
     */
    parName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    /**
     * Valor del parámetro.
     * - varchar(400) en SQL Server
     * - Puede ser NULL
     */
    parValue: {
      type: DataTypes.STRING(400),
      allowNull: true,
    },
  },
  {
    tableName: "admParameter", // Nombre exacto de la tabla en SQL Server
    schema: "dbo",             // Esquema donde se encuentra la tabla
    timestamps: false,         // La tabla no incluye createdAt ni updatedAt
  }
);

export default AdmParameter;
