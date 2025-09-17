import { DataTypes } from "sequelize";
import sequelize from '../../infraestructure/database/connectionSQLServer.js';
/**
 * Modelo Sequelize para la tabla 'Customer'.
 *
 * Esta tabla almacena información de clientes, incluyendo datos de contacto
 * y de identificación fiscal.
 *
 * Estructura de la tabla en SQL Server:
 * - cusId                        (int, PK, Identity, NOT NULL)
 * - cusName                      (varchar(50), NULL)
 * - cusAddressLine1              (varchar(100), NULL)
 * - cusAddressLine2              (varchar(200), NULL)
 * - cusCity                      (varchar(50), NULL)
 * - cusZipCode                   (varchar(15), NULL)
 * - cusCountry                   (varchar(25), NULL)
 * - cusTaxRegistrationNumber     (varchar(15), NULL)
 * - cusExternalId                (varchar(40), NULL)
 *
 * Restricciones:
 * - PK: cusId (PRIMARY KEY, clustered, auto-increment)
 * - FK: Referenciada por TransactionData (FK_TransactionData_Customer)
 */
/**
 * Definición del modelo Customer.
 *
 * @constant
 * @type {Model}
 */
const Customer = sequelize.define(
  "Customer", // Nombre del modelo en Sequelize
  {
    /**
     * Identificador único del cliente.
     * - int en SQL Server
     * - Clave primaria (PK)
     * - Identity (auto-increment)
     * - NOT NULL
     */
    cusId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Nombre del cliente.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    cusName: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Dirección principal del cliente (línea 1).
     * - varchar(100) en SQL Server
     * - NULL permitido
     */
    cusAddressLine1: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    /**
     * Dirección secundaria del cliente (línea 2).
     * - varchar(200) en SQL Server
     * - NULL permitido
     */
    cusAddressLine2: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },

    /**
     * Ciudad del cliente.
     * - varchar(50) en SQL Server
     * - NULL permitido
     */
    cusCity: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    /**
     * Código postal.
     * - varchar(15) en SQL Server
     * - NULL permitido
     */
    cusZipCode: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    /**
     * País del cliente.
     * - varchar(25) en SQL Server
     * - NULL permitido
     */
    cusCountry: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },

    /**
     * Número de identificación fiscal.
     * - varchar(15) en SQL Server
     * - NULL permitido
     */
    cusTaxRegistrationNumber: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },

    /**
     * Identificador externo del cliente (ej: en otro sistema).
     * - varchar(40) en SQL Server
     * - NULL permitido
     */
    cusExternalId: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
  },
  {
    tableName: "Customer", // Nombre exacto de la tabla en SQL Server
    schema: "dbo",         // Esquema donde está la tabla
    timestamps: false,     // No hay columnas createdAt / updatedAt
    indexes: [
      {
        name: "PK_Customer", // Índice de la clave primaria
        unique: true,
        fields: ["cusId"],
      },
    ],
  }
);

export default Customer;
