import { ParkingItem } from "../models/index.js";

class ParkingItemRepository {
  async createParkingItem(data) {
    try {
      console.log("[DEBUG parkingItemRepository] Datos a insertar:", data);
      
      const parkingItem = await ParkingItem.create(data);
      
      console.log("[DEBUG parkingItemRepository] ParkingItem creado:", parkingItem.iteId);
      
      return parkingItem.toJSON();
    } catch (error) {
      console.error("[ERROR parkingItemRepository]", error.message);
      throw error;
    }
  }

  async findByItemId(iteId) {
    try {
      const parkingItem = await ParkingItem.findOne({ 
        where: { iteId } 
      });
      
      return parkingItem ? parkingItem.toJSON() : null;
    } catch (error) {
      console.error("[ERROR parkingItemRepository findByItemId]", error.message);
      throw error;
    }
  }

  async findByTicketId(iteTicketId) {
    try {
      const parkingItem = await ParkingItem.findOne({ 
        where: { iteTicketId } 
      });
      
      return parkingItem ? parkingItem.toJSON() : null;
    } catch (error) {
      console.error("[ERROR parkingItemRepository findByTicketId]", error.message);
      throw error;
    }
  }
}

export default new ParkingItemRepository();