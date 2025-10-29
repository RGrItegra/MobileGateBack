import Customer from './customerModel.js';
import TransactionData from './transactionDataModel.js';
import Device from './deviceModel.js';
import FiscalConfig from './fiscalConfigModel.js';
import Item from './itemModel.js';
import ParkingItem from './parkingItemModel.js';
import Payment from './paymentModel.js';
import Session from './sessionModel.js';

// Aquí haces todas las asociaciones
function setupAssociations() {
  // Customer → TransactionData
  Customer.hasMany(TransactionData, { foreignKey: "cusId", as: "transactions" });
  TransactionData.belongsTo(Customer, { foreignKey: "cusId", as: "customer" });

  // Device → FiscalConfig
  Device.hasMany(FiscalConfig, { foreignKey: "devId", as: "fiscalConfigs" });
  FiscalConfig.belongsTo(Device, { foreignKey: "devId", as: "device" });

  // FiscalConfig → TransactionData
  FiscalConfig.hasMany(TransactionData, { foreignKey: "fisId", as: "transactions" });
  TransactionData.belongsTo(FiscalConfig, { foreignKey: "fisId", as: "fiscalConfig" });

  // Session → TransactionData
  Session.hasMany(TransactionData, { foreignKey: "sesId", as: "transactions" });
  TransactionData.belongsTo(Session, { foreignKey: "sesId", as: "session" });

  // TransactionData → Item
  TransactionData.hasMany(Item, { foreignKey: "traId", as: "items" });
  Item.belongsTo(TransactionData, { foreignKey: "traId", as: "transaction" });

  // Item → ParkingItem
  Item.hasMany(ParkingItem, { foreignKey: "iteId", as: "parkingItems" });
  ParkingItem.belongsTo(Item, { foreignKey: "iteId", as: "item" });

  // TransactionData → Payment
  TransactionData.hasMany(Payment, { foreignKey: "traId", as: "payments" });
  Payment.belongsTo(TransactionData, { foreignKey: "traId", as: "transaction" });
}

export default setupAssociations;

