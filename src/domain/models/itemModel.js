import { DataTypes } from "sequelize";
import sequelize from "../../infraestructure/database/connectionSQLServer.js";

/**
 * Modelo Sequelize para la tabla 'Item'.
 * 
 * Esta tabla almacena los detalles de los ítems/elementos asociados a transacciones.
 * 
 * Estructura de la tabla en SQL Server:
 * - iteId                 (int, PK, Identity, NOT NULL)
 * - iteStrId              (varchar(50), NULL)
 * - iteName               (varchar(50), NULL)
 * - iteDescription        (varchar(200), NULL)
 * - iteQuantity           (decimal(12,2), NULL)
 * - iteQuantityUnit       (varchar(15), NULL)
 * - iteUnitPrice          (decimal(12,2), NULL)
 * - iteTotalPrice         (decimal(12,2), NULL)
 * - iteTaxId              (varchar(50), NULL)
 * - iteItemType           (int, NULL)
 * - disId                 (int, FK a Discount, NULL)
 * - traId                 (int, FK a TransactionData, NOT NULL)
 * - iteTax                (float, NULL)
 * - iteTotalPriceTax      (decimal(12,2), NULL)
 * - iteTotalPriceBaseTax  (decimal(12,2), NULL)
 * - iteTaxName            (varchar(50), NULL)
 * 
 * Restricciones:
 * - PK: iteId
 * - FK: disId → Discount
 * - FK: traId → TransactionData
 * - Referenciada por FK en ParkingItem (iteId)
 */

const Item = sequelize.define(
  "Item",
  {
    iteId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: "Identificador único del ítem (PK, Identity)"
    },
    iteStrId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador alternativo o de referencia del ítem"
    },
    iteName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nombre del ítem"
    },
    iteDescription: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "Descripción del ítem"
    },
    iteQuantity: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: "Cantidad del ítem"
    },
    iteQuantityUnit: {
      type: DataTypes.STRING(15),
      allowNull: true,
      comment: "Unidad de medida de la cantidad"
    },
    iteUnitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: "Precio unitario del ítem"
    },
    iteTotalPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: "Precio total del ítem (sin impuestos)"
    },
    iteTaxId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Identificador del impuesto aplicado"
    },
    iteItemType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Tipo de ítem (categoría o clasificación)"
    },
    disId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "FK a Discount, descuento aplicado al ítem"
    },
    traId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "FK a TransactionData, transacción asociada"
    },
    iteTax: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: "Valor del impuesto aplicado"
    },
    iteTotalPriceTax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: "Precio total con impuestos"
    },
    iteTotalPriceBaseTax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: "Precio total base antes de impuestos"
    },
    iteTaxName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nombre del impuesto aplicado"
    },
  },
  {
    tableName: "Item",
    schema: "dbo",
    timestamps: false,
    indexes: [
      {
        name: "PK_item",
        unique: true,
        fields: ["iteId"],
      },
    ],
  }
);

export default Item;
