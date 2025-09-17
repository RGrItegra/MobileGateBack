import { DataTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";
/**
 * Modelo Sequelize para la tabla 'ParkingItem'.
 * 
 * Esta tabla almacena información de los ítems de parqueadero asociados a transacciones.
 * 
 * Estructura de la tabla en SQL Server:
 * - iteId             (int, PK, FK a Item, NOT NULL)
 * - iteEntryAreaId    (varchar(50), NULL)
 * - iteEntryAreaName  (varchar(50), NULL)
 * - iteEntryDeviceId  (varchar(50), NULL)
 * - iteEntryDeviceName(varchar(50), NULL)
 * - iteEntryTime      (datetime, NULL)
 * - itePaidUntil      (datetime, NULL)
 * - iteTicketId       (varchar(50), NULL)
 * - iteTicketType     (int, NULL)
 * - iteTariffId       (varchar(50), NULL)
 * - iteTariffName     (varchar(50), NULL)
 * 
 * Restricciones:
 * - PK: iteId
 * - FK: iteId → Item
 */

const ParkingItem = sequelize.define(
  "ParkingItem",
  {
    iteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      comment: "PK y FK a Item"
    },
    iteEntryAreaId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador del área de entrada"
    },
    iteEntryAreaName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nombre del área de entrada"
    },
    iteEntryDeviceId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador del dispositivo de entrada"
    },
    iteEntryDeviceName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nombre del dispositivo de entrada"
    },
    iteEntryTime: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha y hora de entrada"
    },
    itePaidUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Fecha y hora hasta la cual se ha pagado"
    },
    iteTicketId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador del ticket"
    },
    iteTicketType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Tipo de ticket"
    },
    iteTariffId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador de la tarifa aplicada"
    },
    iteTariffName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nombre de la tarifa aplicada"
    },
  },
  {
    tableName: "ParkingItem",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_ParkingItem",
        unique: true,
        fields: ["iteId"],
      },
    ],
  }
);


export default ParkingItem;
