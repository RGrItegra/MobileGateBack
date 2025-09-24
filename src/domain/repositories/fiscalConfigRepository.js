import {FiscalConfig} from "../models/index.js";
class FiscalConfigRepository {
  async getLastByDeviceId(devId) {
    return await FiscalConfig.findOne({
      where: { devId },
      order: [['fisId', 'DESC']] // Obtener el más reciente
    });
  }

  async findById(fisId) {
    return await FiscalConfig.findByPk(fisId);
  }
}

export default new FiscalConfigRepository();