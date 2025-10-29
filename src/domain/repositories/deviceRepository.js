

import { Device } from '../models/index.js'

class DeviceRepository {
  async findByUuid(devUuid) {
    return await Device.findOne({
      where: {
        devUuid,
        devEnabled: true 
      }
    });
  }

  async findById(devId) {
    return await Device.findByPk(devId);
  }
}

export default new DeviceRepository();
