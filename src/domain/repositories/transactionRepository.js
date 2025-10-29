import {  TransactionData } from "../models/index.js";

class TransactionRepository {
  async createTransaction(data) {
    
    return await  TransactionData.create(data);
  }
}

export default new TransactionRepository();
