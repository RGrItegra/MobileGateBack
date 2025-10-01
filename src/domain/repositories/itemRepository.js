import { Item } from "../models/index.js";

class ItemRepository {
  async createItem(data) {
    return await Item.create(data);
  }

  async findByTransactionId(traId) {
    return await Item.findAll({
      where: { traId }
    });
  }
}

export default new ItemRepository();



