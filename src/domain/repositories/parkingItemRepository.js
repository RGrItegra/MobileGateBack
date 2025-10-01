import { ParkingItem } from "../models/index.js";

class ParkingItemRepository {
  async createParkingItem(data) {
    return await ParkingItem.create(data);
  }

  async findByItemId(iteId) {
    return await ParkingItem.findOne({ where: { iteId } });
  }
}

export default new ParkingItemRepository();