import { DataTypes } from "sequelize";
import sequelize from '../../infraestructure/database/connectionSQLServer.js';

/**
 * Modelo Sequelize para la tabla 'antenna'.
 *
 * Esta tabla almacena información de antenas RFID, incluyendo:
 * - Dirección IP
 * - Puerto
 * - Estado de lectura
 * - Tipo de antena
 * - Datos EPC/TID de la última lectura
 *
 * Estructura de la tabla en SQL Server:
 * - antId            (tinyint, PK, Identity, NOT NULL)
 * - gerNr            (smallint, NOT NULL)
 * - antIp            (varchar(20), NOT NULL)
 * - antPort          (int, NOT NULL)
 * - antName          (varchar(50), NOT NULL)
 * - antLastReading   (datetime, NULL)
 * - antEnabled       (bit, NOT NULL)
 * - antTimeOut       (int, NOT NULL, DEFAULT 10)
 * - antLastEPC       (varbinary(12), NULL)
 * - antLastTID       (varbinary(12), NULL)
 * - antType          (tinyint, NULL)
 *
 * Restricciones:
 * - PK: antId (PRIMARY KEY, clustered, identity)
 * - FK: Referenciada por antenna_log (FK_antenna_log_antenna)
 */

/**
 * Definición del modelo Antenna.
 *
 * @constant
 * @type {Model}
 */
const Antenna = sequelize.define(
  "Antenna", // Nombre del modelo para Sequelize
  {
    /**
     * Identificador único de la antena.
     * - tinyint en SQL Server
     * - Identity (auto-increment)
     * - Clave primaria (PK)
     * - NOT NULL
     */
    antId: {
      type: DataTypes.TINYINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    /**
     * Número de gerencia a la que pertenece la antena.
     * - smallint en SQL Server
     * - NOT NULL
     */
    gerNr: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },

    /**
     * Dirección IP de la antena.
     * - varchar(20) en SQL Server
     * - NOT NULL
     */
    antIp: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    /**
     * Puerto de conexión.
     * - int en SQL Server
     * - NOT NULL
     */
    antPort: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    /**
     * Nombre de la antena.
     * - varchar(50) en SQL Server
     * - NOT NULL
     */
    antName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    /**
     * Fecha y hora de la última lectura registrada.
     * - datetime en SQL Server
     * - NULL permitido
     */
    antLastReading: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    /**
     * Indica si la antena está activa.
     * - bit en SQL Server
     * - NOT NULL
     */
    antEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    /**
     * Tiempo de espera en milisegundos.
     * - int en SQL Server
     * - NOT NULL
     * - DEFAULT 10
     */
    antTimeOut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },

    /**
     * Último código EPC leído.
     * - varbinary(12) en SQL Server
     * - NULL permitido
     */
    antLastEPC: {
      type: DataTypes.BLOB("tiny"),
      allowNull: true,
    },

    /**
     * Último TID leído.
     * - varbinary(12) en SQL Server
     * - NULL permitido
     */
    antLastTID: {
      type: DataTypes.BLOB("tiny"),
      allowNull: true,
    },

    /**
     * Tipo de antena.
     * - tinyint en SQL Server
     * - NULL permitido
     */
    antType: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
  },
  {
    tableName: "antenna", // Nombre exacto de la tabla
    schema: "dbo",        // Esquema SQL Server
    timestamps: false,    // No hay createdAt / updatedAt

    indexes: [
      {
        name: "PK_antenna",
        unique: true,
        fields: ["antId"],
      },
    ],
  }
);

export default Antenna;
