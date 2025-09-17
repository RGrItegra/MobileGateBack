import sequelize from '../../infraestructure/database/connectionSQLServer.js';
import Customer from './customerModel.js';
import TransactionData from './transactionDataModel.js';
import Device from './deviceModel.js';
import FiscalConfig from './fiscalConfigModel.js';
import Item from './itemModel.js';
import ParkingItem from './parkingItemModel.js';
import Payment from './paymentModel.js';
import Session from './sessionModel.js';
import User from './userModel.js';
import setupAssociations from './associations.js';

// Ejecuta las asociaciones
setupAssociations();

export {
  sequelize,
  Customer,
  TransactionData,
  Device,
  FiscalConfig,
  Item,
  ParkingItem,
  Payment,
  Session,
 User
};
